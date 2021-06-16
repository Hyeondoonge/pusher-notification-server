const PushNotifications = require("@pusher/push-notifications-server");
const fetch = require('node-fetch');
const env = require('dotenv').config();

// 알림 서버
let beamsClient = new PushNotifications({
  instanceId: process.env.INSTANCE_ID,
  secretKey: process.env.SECRET_KEY,
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

  switch (type) {
    case 'comment': 
      notifyNewComment(req.body);
      break;
    case 'reply': 
      notifyNewReply(req.body);
      break;
    case 'post': 
      notifyNewPost(req.body);
      break;
    case 'follow_project': 
      notifyNewProjectFollower(req.body); 
      break;
    case 'create_task': 
      notifyCreateTask(req.body);
      break;
    case 'create_team_project': 
      notifyCreateNewTeamProject(req.body);
      break;
    case 'follow_team': 
      notifyNewTeamFollower(req.body);
      break;
    case 'update_post': 
      notifyUpdatePost(req.body);
      break;
    case 'invite_project': 
      notifyInviteProject(req.body);
      break;
    case 'invite_team': 
      notifyInviteTeam(req.body);
      break;
    case 'delegate_team_master': 
      notifyDelegateTeamMaster(req.body);
      break;
    case 'delegate_project_master': 
      notifyDelegateProjectMaster(req.body);
      break;
    case 'postLike': 
      notifyPostLike(req.body); 
      break;
  };
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
          "deep_link": `https://teamlog.netlify.app/projects/${teamId}`,
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

  const realTargets = [...members].filter((id) => id !== source);
  if (realTargets.length === 0) return;

  const teamName = await fetch(`http://3.15.16.150:8090/api/teams/${teamId}`)
  .then((res) => res.json()).then((res) => res.name);

    beamsClient
    .publishToInterests(realTargets , {
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
  
  const realTargets = [...members].filter((id) => id !== source);
  if (realTargets.length === 0) return;

    beamsClient
    .publishToInterests(realTargets, {
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

  const realTargets = [...targets].filter((id) => id !== source);
  if (realTargets.length === 0) return;

  const postContent = await fetch(`http://3.15.16.150:8090/api/posts/${postId}`)
        .then((res) => res.json()).then((res) => res.contents);

  console.log(postContent.substr(0, 10));

  beamsClient
    .publishToInterests(realTargets, { // targets
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

const notifyNewComment = ({ target, source, projectId }) => {
    // client로 부터 요청을 받아 특정 사용자에게 푸시 알림을 전송
    if (target === source) return;

    beamsClient
      .publishToInterests([target], {
        web: {
          notification: {
            "title": 'Teamlog',
            "body": `${source}님이 내 게시물에 댓글을 남겼습니다.`,
            "deep_link": `https://teamlog.netlify.app/projects/${projectId}/post`,
            "icon": "http://localhost:3001/pusher/logo.png",
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

const notifyNewPost = async ({ targets, source, projectId, projectName }) => {
  // client로 부터 요청을 받아 특정 사용자에게 푸시 알림을 전송
  const realTargets = [...targets].filter((id) => id !== source);
  if (realTargets.length === 0) return;

  beamsClient
    .publishToInterests(realTargets, { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 ${projectName} 프로젝트에 글을 남겼습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${projectId}/post`,
          "icon": "http://localhost:3001/pusher/logo.png",
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
};

const notifyNewReply = async ({ target, source, projectId }) => {
  // client로 부터 요청을 받아 특정 사용자에게 푸시 알림을 전송
  if (target === source) return;

  beamsClient
    .publishToInterests([target], { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 나의 댓글에 답글을 남겼습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${projectId}/post`,
          "icon": "http://localhost:3001/pusher/logo.png",
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
};

const notifyPostLike = ({ target, source, projectId }) => {
  if (target === source) return;

  beamsClient
    .publishToInterests([target], { // targets
      web: {
        notification: {
          "title": 'TeamLog',
          "body": `${source}님이 나의 게시물에 좋아요를 눌렀습니다.`,
          "deep_link": `https://teamlog.netlify.app/projects/${projectId}/post`,
          "icon": "http://localhost:3001/pusher/logo.png",
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
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});