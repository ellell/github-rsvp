var GitHubApi = require('github')
  , parallel = require('run-parallel')

  , github = new GitHubApi({
        version: '3.0.0'
      , protocol: 'https'
      , timeout: 5000
      , headers: { 'user-agent': 'Unanswered-github-issues' }
    })

  , getIssueComments = function (issue, done) {
      github.issues.getComments({
          number: issue.number
        , user: issue.repository.owner.login
        , repo: issue.repository.name
      }, done)
    }

  , getIssuesWithComments = function (done) {
      github.issues.getAll({ filter: 'mentioned' }, function (err, issues) {
        if (err) return done(err)

        parallel(issues.map(function (issue) {
          return function (cb) {
            getIssueComments(issue, function (err, comments) {
              if (err) return cb(err)

              issue.comments = comments || []
              cb(null, issue)
            })
          }
        }), done)
      })
    }

module.exports = function (opts, callback) {
  if (opts.token)
    github.authenticate({
        type: 'oauth'
      , token: opts.token
    })
  else if (opts.username && opts.password) {
    github.authenticate({
        type: 'basic'
      , username: opts.username
      , password: opts.password
    })
  } else {
    return callback(new Error('token or username & password required'))
  }

  github.user.get({}, function (err, user) {
    if (err) return callback(err)

    var username = user.login
      , userregexp = new RegExp(username)

    getIssuesWithComments(function (err, issues) {
      if (err) return callback(err)

      var unansweredIssues = issues.filter(function (issue) {
        var unanswered = true
        issue.comments.forEach(function (comment) {
          if (userregexp.test(comment.body))
            unanswered = true

          if (comment.user.login === username)
            unanswered = false
        })
        return unanswered
      })
      callback(null, unansweredIssues)
    })
  })
}

// philosophers.indexOf(person) >= 0