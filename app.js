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
const port = 80;

app.use(bodyParser.json());
app.use(cors());

app.post('/push-notification', (req, res) => {
  const { type } = req.body;
  if (type === 'comment') notifyNewComment(req.body); // 댓글 등록 알림
  if (type === 'post') notifyNewPost(req.body); // 포스트 등록 알림
  if (type === 'follow_project') notifyNewProjectFollower(req.body); // 프로젝트 팔로우 알림
  if (type == 'create_task') notifyCreateTask(req.body); // 태스크 생성 알림
  if (type == 'create_team_project') notifyCreateNewTeamProject(req.body) // 팀 내 프로젝트 생성 알림
  if (type == 'follow_team') notifyNewTeamFollower(req.body); // 팀 팔로우 알림
  if (type == 'update_post') notifyUpdatePost(req.body); // 게시물 수정 알림
  if (type == 'invite_project') notifyInviteProject(req.body); // 프로젝트 초대 알림
  if (type == 'invite_team') notifyInviteTeam(req.body); // 팀 초대 알림
  if (type == 'delegate_team_master') notifyDelegateTeamMaster(req.body); // 팀 마스터 위임
  if (type == 'delegate_project_master') notifyDelegateProjectMaster(req.body); // 프로젝트 마스터 위임

  res.status(201).send({ msg: 'ok' });
});

// 프로젝트 마스터 위임
const notifyDelegateProjectMaster = async ({ projectId, target, source }) => {  
  const projectName = await fetch(`http://3.15.16.150:8090/api/projects/${projectId}`)
        .then((res) => res.json()).then((res) => res.name);

  beamsClient
    .publishToInterests([target], { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 ${target}님에게 ${projectName} 프로젝트 마스터를 위임하셨습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${projectId}`,
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

// 팀 마스터 위임
const notifyDelegateTeamMaster = async ({ teamId, target, source }) => {  
  const teamName = await fetch(`http://3.15.16.150:8090/api/teams/${teamId}`)
        .then((res) => res.json()).then((res) => res.name);

  beamsClient
    .publishToInterests([target], { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 ${target}님에게 ${teamName} 팀 마스터를 위임하셨습니다.`,
          "deep_link": `https://teamlog.netlify.app/teams/${teamId}`,
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

// 프로젝트 초대 시
const notifyInviteProject = async ({ projectId, targets, source }) => {  
  const projectName = await fetch(`http://3.15.16.150:8090/api/projects/${projectId}`)
        .then((res) => res.json()).then((res) => res.name);

  beamsClient
    .publishToInterests(targets, { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 ${projectName} 프로젝트에 초대하셨습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${projectId}`,
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

// 팀 초대 시
const notifyInviteTeam = async ({ teamId, targets, source }) => {  
  const teamName = await fetch(`http://3.15.16.150:8090/api/teams/${teamId}`)
        .then((res) => res.json()).then((res) => res.name);

  beamsClient
    .publishToInterests(targets, { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 ${teamName} 팀에 초대하셨습니다.`,
          "deep_link": `https://teamlog.netlify.app/teams/${teamId}`,
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


// 새 프로젝트 팀 생성 시
const notifyCreateNewTeamProject = async ({ projectName, teamId, source }) => {
  const targets = await fetch(`http://3.15.16.150:8090/api/teams/${teamId}/members`)
        .then((res) => res.json()).then((res) => res.map((member) => member.id));
  
  const teamName = await fetch(`http://3.15.16.150:8090/api/teams/${teamId}`)
        .then((res) => res.json()).then((res) => res.name);

  console.log(targets);


  beamsClient
    .publishToInterests(targets, { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 ${teamName}팀 내에 ${projectName} 프로젝트를 생성했습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${teamId}/projects`,
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

// 태스크 생성 시
const notifyCreateTask = ({ projectId, target, objective, source, type }) => {
  console.log(target, objective, source, type);

  const members = target.map((member) => member.id);

    beamsClient
    .publishToInterests(members, {
      web: {
        notification: {
          "title": 'Teamlog',
          "body": `${source}님이 ${objective} 프로젝트에 태스크를 생성했습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${projectId}/task`,
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

// 새로운 사용자가 팀 팔로우 시
const notifyNewTeamFollower = async ({ teamId, source }) => {
  const members = await fetch(`http://3.15.16.150:8090/api/teams/${teamId}/members`)
  .then((res) => res.json()).then((res) => res.map((member) => member.id));

  const teamName = await fetch(`http://3.15.16.150:8090/api/teams/${teamId}`)
  .then((res) => res.json()).then((res) => res.name);

    beamsClient
    .publishToInterests(members, {
      web: {
        notification: {
          "title": 'Teamlog',
          "body": `${source}님이 ${teamName} 팀을 팔로우하셨습니다.`,
          "deep_link": `https://teamlog.netlify.app/teams/${teamId}/follower`,
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

// 새로운 사용자가 프로젝트 팔로우 시
const notifyNewProjectFollower = ({ projectId, target, objective, source, type }) => {
  console.log(target, objective, source, type);

  const members = target.map((member) => member.id);

    beamsClient
    .publishToInterests(members, {
      web: {
        notification: {
          "title": 'Teamlog',
          "body": `${source}님이 ${objective} 프로젝트를 팔로우하셨습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${projectId}/follower`,
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

// 게시물 수정 시
const notifyUpdatePost = async ({ source, project, postId }) => {
  const targets = await fetch(`http://3.15.16.150:8090/api/projects/${project.id}/members`)
        .then((res) => res.json()).then((res) => res.map((member) => member.id));

  const postContent = await fetch(`http://3.15.16.150:8090/api/posts/${postId}`)
        .then((res) => res.json()).then((res) => res.contents);

  console.log(postContent.substr(0, 10));

  beamsClient
    .publishToInterests(targets, { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 ${project.name} 프로젝트 게시물(${postContent.substr(0, 10)}...)을 수정하셨습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${project.id}/post`,
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

/////////////////////////////////////////////////////// 밑에서부터는 원래 코드

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