import { io } from "socket.io-client";

let socket;
let peerConnections = {};
let peerChannels = {};

let socketId = [];
let userList = {};

export const webrtc = {
  disconnect: () => {
    if (!socket) {
      console.error("is null socket");
      return;
    }

    socket.disconnect();
    for (const [key, channel] of Object.entries(peerChannels)) {
      channel.close();
    }

    for (const [key, connection] of Object.entries(peerConnections)) {
      connection.close();
    }
  },
  connect: (room, userId, userType, callback) => {
    socket = io("http://localhost:28099");
    socket.on("connect", () => {
      /**
       * 선생님일 경우 모든 학생 내보내기
       */
      if (userType && userType === "admin") {
        socket.emit("clear");
      }

      peerConnections = {};
      peerChannels = {};
      socketId = socket.id;
      userList = [];

      socket.emit("join_room", { room, userId, userType });

      callback("issuedUserId", socket.id);
    });

    socket.on("connect_error", (e) => {
      console.error("connect_error", e);
    });

    socket.on("disconnect", (reason) => {
      console.error("socket", reason);

      callback("disconnected", reason);
    });

    // peer A's code
    socket.on("all_users", (users) => {
      users.forEach(async (user) => {
        if (
          !(
            userType === "admin" ||
            (userType !== "admin" && user.userType === "admin")
          )
        ) {
          return;
        }

        const pc = webrtc.createPeerConnection(user.id, user.userId, userId);
        if (!(pc && socket && socket.connected)) return;

        const channel = pc.createDataChannel("chat");
        channel.onopen = (event) => {
          callback("connected", user);
        };

        channel.onclose = (event) => {
          callback("closed", user);
        };

        channel.onmessage = (event) => {
          if (!event.data) return;
          const recvMessage = JSON.parse(event.data);
          callback("message", recvMessage);
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
          offerUserType: userType,
          offerReceiveID: user.id,
        });
      });
    });

    // peer B's code
    socket.on("getOffer", async (offer) => {
      const { sdp, offerSendID, offerSendUserId, offerUserType } = offer;

      const pc = webrtc.createPeerConnection(
        offerSendID,
        offerSendUserId,
        userId
      );
      if (!(pc && socket && socket.connected)) return;

      peerConnections[offerSendUserId] = pc;
      await pc.setRemoteDescription(sdp);

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

        event.channel.onopen = (event) => {
          callback("offer connected", {
            id: offerSendID,
            userId: offerSendUserId,
            userType: offerUserType,
          });
        };
        event.channel.onclose = (event) => {
          userList = userList.filter((r) => r.id !== offerSendID);

          callback("offer closed", {
            id: offerSendID,
            userId: offerSendUserId,
            userType: offerUserType,
          });
        };
        event.channel.onmessage = (event) => {
          if (!event.data) return;
          const recvMessage = JSON.parse(event.data);
          callback("message", recvMessage);
        };
      };
    });

    socket.on("getAnswer", (answer) => {
      const { sdp, answerSendID, answerSendUserId } = answer;

      const pc = peerConnections[answerSendUserId];
      if (!pc) return;

      pc.setRemoteDescription(sdp);
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
      if (userType !== "admin") {
        return;
      }
      callback("disconnected", user);

      if (peerChannels[user.userId]) {
        peerChannels[user.userId].close();
        delete peerChannels[user.userId];
      }
      if (peerConnections[user.userId]) {
        peerConnections[user.userId].close();
        delete peerConnections[user.userId];
      }

      userList = userList.filter((peerUser) => peerUser.id !== user.id);
    });
  },

  createPeerConnection: (id, remoteUserId, localUserId) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:20.194.41.27:3478" },
          {
            urls: "turn:20.41.74.222:3478",
            username: "ism",
            credential: "brief",
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
      return undefined;
    }
  },
  sendMessageAll: (message) => {
    for (const [key, channel] of Object.entries(peerChannels)) {
      try {
        channel.send(JSON.stringify(message));
      } catch (e) {
        console.error("sendMessage error", e);
      }
    }
  },

  sendMessage: (message, user) => {
    const channel = peerChannels[user.userId];
    if (!channel) {
      console.error("not found channer", user);
      return;
    }
    channel.send(JSON.stringify(message));
  },
};
