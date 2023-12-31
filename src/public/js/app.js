const socket = io();

let peerConnections = {};
let peerChannels = {};
let roomName = 123;

let socketId = [];
let userList = [];

let userId = "";

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
  const userType = "student";
  socket.emit("join_room", { roomName, userId, userType });
}

function handleWelcomeSubmit(event) {
  event.preventDefault();
  resetConnections();
  userId = "teacher" + Math.floor(Math.random() * 1000000);
  const userType = "teacher";
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

function sendMessageAll(message) {
  console.log("peerChannels", peerChannels);
  for (const [key, channel] of Object.entries(peerChannels)) {
    console.log("sendMessageAll", key, channel);
    try {
      channel.send(JSON.stringify(message));
    } catch (e) {
      console.error("sendMessage error", e);
    }
  }
}

function sendMessage(message, user) {
  const channel = peerChannels[user.userId];
  if (!channel) {
    console.error("not found channer", user);
    return;
  }
  channel.send(JSON.stringify(message));
}

socket.on("all_users", (users) => {
  users.forEach(async (user) => {
    console.log("all_users", user);

    if (user.userType === "student") return;

    const pc = createPeerConnection(user.id, user.userId, userId);
    if (!(pc && socket && socket.connected)) return;

    const channel = pc.createDataChannel("chat");

    channel.onopen = () => {
      console.log("channel onopen");
    };
    channel.onclose = () => {
      console.log("channel onclose");
    };
    channel.onmessage = (e) => {
      if (!e.data) return;
      const recvMessage = JSON.parse(e.data);
      console.log("channel onmessage", recvMessage);
    };

    peerConnections[user.userId] = pc;
    peerChannels[user.userId] = channel;
    userList.push({
      id: user.id,
      userId: user.userId,
      userType: user.userType,
    });

    const offer = await pc.createOffer({ iceRestart: true });
    await pc.setLocalDescription(offer);

    socket.emit("offer", {
      sdp: pc.localDescription,
      offerSendID: socket.id,
      offerSendUserId: userId,
      offerUserType: user.userType,
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

  //다른 브라우저에게 응답을 보내는 부분ㄴ
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
      console.log("offer connected", {
        id: offerSendID,
        userId: offerSendUserId,
        userType: offerUserType,
      });
    };

    event.channel.onclose = (event) => {
      userList = userList.filter((user) => user.id !== offerSendID);

      console.log("offer disconnected", {
        id: offerSendID,
        userId: offerSendUserId,
        userType: offerUserType,
      });
    };

    event.channel.onmessage = (event) => {
      if (!event.data) return;
      const recvMessage = JSON.parse(event.data);
      console.log("offer onmessage", recvMessage);
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
  if (user.userType !== "teacher") {
    return;
  }

  if (peerConnections[user.userId]) {
    peerConnections[user.userId].close();
    delete peerConnections[user.userId];
  }

  if (peerChannels[user.userId]) {
    peerChannels[user.userId].close();
    delete peerChannels[user.userId];
  }

  userList = userList.filter((user) => user.id !== socket.id);
  console.log("user_exit", user);
  console.log("userList", userList);
});
