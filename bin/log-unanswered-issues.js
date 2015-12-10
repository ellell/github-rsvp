#!/usr/bin/env node

var meow = require('meow')
  , ghauth = require('ghauth')
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

        console.log('Unanswered issues:');

        issues.forEach(function (issue) {
          console.log(issue.title);
          console.log(issue.html_url);
          console.log('\n');
        });
      })
    }

if (cli.flags.token || (cli.flags.username && cli.flags.password)) {
  logIssues(cli.flags)
}  else {
  ghauth({configName: 'github-rsvp', scopes: ['repo']}, function (err, auth) {
    if (err) return console.log('err', err)

    logIssues({
        username: auth.user
      , token: auth.token
    })
  })
}
