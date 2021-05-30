const PushNotifications = require("@pusher/push-notifications-server");
const fetch = require('node-fetch');

// 알림 서버
let beamsClient = new PushNotifications({
  instanceId: "9626f19b-467e-44bb-9702-f4ea986cab5e",
  secretKey: "18284F667805ABC4B341AF6D1A413F3F0A064E7265CD071A89E1B59C5C524378",
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/push-notification', (req, res) => {
  const { type } = req.body;
  if (type === 'comment') notifyNewComment(req.body);
  if (type === 'post') notifyNewPost(req.body);
  
  res.status(201).send({ msg: 'ok' });
});

const notifyNewComment = ({ target, source, type }) => {
    // client로 부터 요청을 받아 특정 사용자에게 푸시 알림을 전송
    console.log(target, source, type);

    beamsClient
      .publishToInterests([target], {
        web: {
          notification: {
            "title": 'Teamlog',
            "body": `${source}님이 내 게시물에 댓글을 남겼습니다.`,
            "deep_link": "https://teamlog.netlify.app/main",
            "icon": "http://localhost:5500/pusher/logo.png",
          },
          data: {
            some: 'meta',
          },
          time_to_live: 2419200,
        },
      })
      .then((publishResponse) => {
        console.log("Just published:", publishResponse.publishId);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

const notifyNewPost = async ({ source, projectId }) => {
  // client로 부터 요청을 받아 특정 사용자에게 푸시 알림을 전송
  const targets = await fetch(`http://3.15.16.150:8090/api/projects/${projectId}/members`)
        .then((res) => res.json()).then((res) => res.map((member) => member.id));
  
  const projectName = await fetch(`http://3.15.16.150:8090/api/projects/${projectId}`)
        .then((res) => res.json()).then((res) => res.name);

  console.log(targets);

  beamsClient
    .publishToInterests(targets, { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 ${projectName}프로젝트에 글을 남겼습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${projectId}/post`,
          "icon": "http://localhost:5500/pusher/logo.png",
        },
        data: {
          some: 'meta',
        },
        time_to_live: 2419200,
      },
    })
    .then((publishResponse) => {
      console.log("Just published:", publishResponse.publishId);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
});