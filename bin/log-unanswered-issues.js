#!/usr/bin/env node


var meow = require('meow')
  , ghauth = require('ghauth')
  , unansweredGithubIssues = require('../unanswered-github-issues')
  , colors = require('chalk')
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

        console.log(colors.yellow.inverse(' Unanswered issues: '));
        console.log();

        issues.forEach(function (issue) {
          var title = colors.magenta(issue.title);
          if (issue.pull_request) {
            title = title + colors.yellow('*');
          }
          console.log(title);
          console.log(colors.blue(' > %s'), colors.underline(issue.html_url));
          console.log(colors.grey.dim('   C:%s U:%s'), issue.created_at, issue.updated_at);
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
