#!/usr/bin/env node

var unansweredGithubIssues = require('../unanswered-github-issues')
  , token = process.argv[2]

unansweredGithubIssues({ token: token }
  , function (err, issues) {
    if (err) return console.log('err', err)

    console.log('Unanswered issues:\n'
      , issues.map(function (issue) { return issue.html_url } ).join('\n'))
  })


