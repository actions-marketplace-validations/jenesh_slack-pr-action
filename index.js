require('dotenv').config()
const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const { Octokit } = require("@octokit/core");

const postComment = async (prNum) => {
  const ghToken = core.getInput('gh_token');
  const eventNum = core.getInput('event_num')
  const repo = core.getInput('repo')

  const issueURL = `https://api.github.com/repos/${repo}/issues/${eventNum}/comments`

  const commitID = `94d6e905bae0a2981b175526232f51cc5502eac5`
  const commitURL = `https://api.github.com/repos/codecademy-engineering/Codecademy/commits/${commitID}/comments`


  console.log(`URLLRLLRLRLR`, issueURL)

  const config = {
    method: 'post',
    data: {
      body: `Awaiting approval from PM and designer`
    },
    headers: {
      Authorization: `Bearer ${ghToken}`,
    }
  }
  try {
    const body = {
      method: 'post',
      data: {
        body: `Hello from the other side. Your PR is waiting from approval from
        PM: ❌
        PD: ❌
        `,
        path: `.github/workflows/hackathon_slack_bot.yml`,
        position: 1,
        line: null
      }
    }

    const headers = {
        authorization: `Bearer ${ghToken}`
    }

    const { data } = await axios.post(issueURL, body, headers)


  // const data = await octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
  //   owner: 'codecademy-engineering',
  //   repo: 'Codecademy',
  //   pull_number: prNum,
  //   body: 'Waiting for PM and PD approval',
  //   commit_id: 'commit_id',
  //   path: 'path'
  // })

  console.log('Results from post request =====> ', data)

  } catch (err) {
    console.log(`Comment Error: `, err)
  }
}

const test = () => {
  // const test = github.repo()
  // console.log(`Github Repo ===>`, test)


  try {
    /*
      RUN THIS ncc build index.js
    */
    postComment(github.context.payload.pull_request.number);

    const slackHook = core.getInput('slack_hook');
    console.log("SLACKHOOK", slackHook)
    console.log("PAYLOAD", JSON.stringify(github.context.payload))
    const complexMsg = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "You have a new request:\n*<fakeLink.toEmployeeProfile.com|Fred Enriquez - New device request>*"
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Approve"
              },
              "style": "primary",
              "value": `${JSON.stringify(github.context.payload.pull_request.number)}`
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Deny"
              },
              "style": "danger",
              "value": `${JSON.stringify(github.context.payload.pull_request.number)}`
            }
          ]
        }
      ]
    }

    axios.post(slackHook, complexMsg)
      .then(data => console.log(`Success`, data))
      .catch(err => console.log(`Error =>`, err))

  } catch (error) {
    core.setFailed(error.message);
  }
}

test()
