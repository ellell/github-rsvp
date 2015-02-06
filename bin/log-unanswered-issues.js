#!/usr/bin/env node

var meow = require('meow')
  , prompt = require('prompt')
  , unansweredGithubIssues = require('../unanswered-github-issues')
  , cli = meow({
        pkg: '../package.json'
      , help: [
            'Commands: '
          , '  github-rsvp'
          , '  github-rsvp -u <github-username> -p <github-password>'
          , '  github-rsvp -t <github-access-token>'
        ].join('\n')
    }
    , {
      alias: {
          'u': 'username'
        , 'p': 'password'
        , 't': 'token'
      }
    })

  , logIssues = function (opts) {
      unansweredGithubIssues(opts, function (err, issues) {
        if (err) return console.log('err', err)

        console.log('Unanswered issues:\n'
          , issues.map(function (issue) { return issue.html_url } ).join('\n'))
      })
    }

if (cli.flags.token || (cli.flags.username && cli.flags.password)) {
  logIssues(cli.flags)
}  else {
  prompt.start()
  var promptSchema = {
    properties: {
        username: { required: true }
      , password: { required: true, hidden: true }
    }
  }
  prompt.get(promptSchema, function (err, input) {
    if (err) return console.log('err', err)

    logIssues(input)
  })
}