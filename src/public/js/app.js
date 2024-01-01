const socket = io();

let peerConnections = {};
let peerChannels = {};
let roomName = 123;

let socketId = [];
let userList = [];

let userId = "";
let userType = "";

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

const student = document.getElementById("student");
const studentForm = student.querySelector("form");

studentForm.addEventListener("submit", handleStudentSubmit);
welcomeForm.addEventListener("submit", handleWelcomeSubmit);

function resetConnections() {
  peerConnections = {};
  peerChannels = {};
  socketId = socket.id;
  userList = [];

  // console.log(
  //   "resetConnections",
  //   peerConnections,
  //   peerChannels,
  //   socketId,
  //   userList
  // );
}

function handleStudentSubmit(event) {
  event.preventDefault();
  resetConnections();
  userId = "student" + Math.floor(Math.random() * 1000000);
  userType = "student";
  student.hidden = true;
  socket.emit("join_room", { roomName, userId, userType });
}

function handleWelcomeSubmit(event) {
  event.preventDefault();
  resetConnections();
  userId = "teacher" + Math.floor(Math.random() * 1000000);
  userType = "teacher";
  welcome.hidden = true;
  socket.emit("join_room", { roomName, userId, userType });
}

function createPeerConnection(id, remoteUserId, localUserId) {
  try {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });

    pc.onicecandidate = (e) => {
      if (!(socket && e.candidate)) {
        return;
      }

      socket.emit("candidate", {
        candidate: e.candidate,
        candidateSendID: socket.id,
        candidateSendUserID: localUserId,
        candidateReceiveID: id,
        candidateReceiveUserID: remoteUserId,
      });
    };

    pc.ontrack = (e) => {
      userList = userList
        .filter((user) => user.id !== id)
        .concat({
          id,
          remoteUserId,
          stream: e.streams[0],
        });
    };

    return pc;
  } catch (e) {
    console.error(e);
    return;
  }
}

const sendMessageAll = (message) => {
  for (const [key, channel] of Object.entries(peerChannels)) {
    console.log(
      `${
        userType === "teacher" ? "학생" : "선생님"
      }(${key})에게 메시지 ${message}를 보냅니다.`
    );

    try {
      channel.send(JSON.stringify(message));
    } catch (e) {
      console.error("sendMessage error", e);
    }
  }
};

const sendMessage = (message, user) => {
  const channel = user
    ? peerChannels[user.userId]
    : peerChannels[userList[0].userId];
  if (!channel) {
    console.error("not found channer", user);
    return;
  }

  console.log(
    user
      ? `선생님이 학생(${user.userId})에게 메시지 ${message}를 보냅니다.`
      : `선생님이 학생(${userList[0].userId})에게 메시지 ${message}를 보냅니다.`
  );
  channel.send(JSON.stringify(message));
};

socket.on("all_users", (users) => {
  console.log("all_users", users);
  users.forEach(async (user) => {
    if (user.userType === "student") return;

    const pc = createPeerConnection(user.id, user.userId, userId);

    if (!(pc && socket && socket.connected)) return;

    const channel = pc.createDataChannel("chat");

    channel.onopen = () => {
      console.log(`선생님(${user.userId})과 연결되었습니다.`);
    };

    channel.onclose = () => {
      console.log(`선생님(${user.userId})과 연결이 끊어졌습니다.`);
    };

    channel.onmessage = (event) => {
      if (!event.data) return;
      const recvMessage = JSON.parse(event.data);
      console.log(
        `선생님(${user.userId})로부터 메시지 ${recvMessage}를 받았습니다.`
      );
    };

    peerConnections[user.userId] = pc;
    peerChannels[user.userId] = channel;
    userList.push({
      id: user.id,
      userId: user.userId,
      userType,
    });

    const offer = await pc.createOffer({ iceRestart: true });
    await pc.setLocalDescription(offer);

    socket.emit("offer", {
      sdp: pc.localDescription,
      offerSendID: socket.id,
      offerSendUserId: userId,
      offerUserType: userType,
      offerReceiveID: user.id,
    });
  });
});

// Peer B's code
socket.on("getOffer", async (offer) => {
  const { sdp, offerSendID, offerSendUserId, offerUserType } = offer;
  const pc = createPeerConnection(offerSendID, offerSendUserId, userId);
  if (!(pc && socket && socket.connected)) return;

  peerConnections[offerSendUserId] = pc;
  await pc.setRemoteDescription(sdp);

  //다른 브라우저에게 응답을 보내는 부분
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  socket.emit("answer", {
    sdp: pc.localDescription,
    answerSendID: socket.id,
    answerSendUserId: userId,
    answerReceiveID: offerSendID,
  });

  pc.ondatachannel = (event) => {
    peerChannels[offerSendUserId] = event.channel;

    userList.push({
      id: offerSendID,
      userId: offerSendUserId,
      userType: offerUserType,
    });

    event.channel.onopen = () => {
      console.log(`학생(${offerSendUserId})과 연결되었습니다.`);

      // console.log("학생과 연결되었습니다.", {
      //   id: offerSendID,
      //   userId: offerSendUserId,
      //   userType: offerUserType,
      // });
    };

    event.channel.onclose = () => {
      userList = userList.filter((user) => user.id !== offerSendID);
      console.log(`학생(${offerSendUserId})과 연결이 끊어졌습니다.`);

      // console.log("학생과 연결이 끊어졌습니다.", {
      //   id: offerSendID,
      //   userId: offerSendUserId,
      //   userType: offerUserType,
      // });
    };

    event.channel.onmessage = (event) => {
      if (!event.data) return;
      const recvMessage = JSON.parse(event.data);
      console.log(
        `학생(${offerSendUserId})으로부터 메시지(${recvMessage})를 받았습니다.`
      );
    };
  };
});

socket.on("getAnswer", async (answer) => {
  const { sdp, answerSendID, answerSendUserId } = answer;
  const pc = peerConnections[answerSendUserId];
  if (!(pc && socket && socket.connected)) return;
  await pc.setRemoteDescription(sdp);
});

socket.on("getCandidate", async (data) => {
  const {
    candidate,
    candidateSendID,
    candidateSendUserID,
    candidateReceiveID,
    candidateReceiveUserID,
  } = data;

  const pc = peerConnections[candidateSendUserID];

  if (!pc) return;
  await pc.addIceCandidate(candidate);
});

socket.on("user_exit", (user) => {
  console.log("user_exit", user);
  // 선생은 학생이 나가면 학생을 지워야함 추가 확인 필요
  if (user.userType !== "teacher") return;

  userList = userList.filter((user) => user.id !== user.id);

  if (peerConnections[user.userId]) {
    peerConnections[user.userId].close();
    delete peerConnections[user.userId];
  }

  if (peerChannels[user.userId]) {
    peerChannels[user.userId].close();
    delete peerChannels[user.userId];
  }

  console.log("user_exit", user);
  console.log("userList", userList);
});
