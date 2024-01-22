import "regenerator-runtime";
import http from "http";
import SocketIO from "socket.io";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const io = SocketIO(httpServer, {
  cors: {
    origin: "*",
  },
});

// global values
const MAXIMUM = process.env.SOCKET_ROOM_MAXIMUM || 30;
const users = {};
const socketToRoom = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    console.log("joinRoom", data);

    if (users[data.roomName]) {
      const length = users[data.roomName].length;

      if (length === MAXIMUM) {
        socket.to(socket.id).emit("room_full");
        return;
      }

      users[data.roomName].push({
        id: socket.id,
        userId: data.userId,
        userType: data.userType,
      });
    } else {
      if (data.userType === "teacher") {
        users[data.roomName] = [
          { id: socket.id, userId: data.userId, userType: data.userType },
        ];
      } else {
        // 방이 없는데 학생이 들어오면 방이 없다고 알려주기
        console.log("roomNotExist");
        io.sockets
          .to(socket.id)
          .emit("roomNotExist", { roomName: data.roomName });
        return;
      }
    }

    socketToRoom[socket.id] = data.roomName;

    socket.join(data.roomName);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    let usersInThisRoom = users[data.roomName].filter(
      (user) => user.id !== socket.id
    );

    console.log("usersInThisRoom", usersInThisRoom);
    io.sockets.to(socket.id).emit("allUsers", usersInThisRoom);
  });

  socket.on("offer", (data) => {
    // console.log("offer", data);
    const { sdp, offerSendID, offerSendUserId, offerUserType, offerReceiveID } =
      data;
    socket
      .to(offerReceiveID)
      .emit("getOffer", { sdp, offerSendID, offerSendUserId, offerUserType });
  });

  socket.on("answer", (data) => {
    // console.log("answer", data);
    const { sdp, answerSendID, answerSendUserId, answerReceiveID } = data;
    socket
      .to(answerReceiveID)
      .emit("getAnswer", { sdp, answerSendID, answerSendUserId });
  });

  socket.on("candidate", (data) => {
    // console.log("socket on candidate", data);
    const {
      candidate,
      candidateSendID,
      candidateSendUserID,
      candidateReceiveID,
      candidateReceiveUserID,
    } = data;
    socket.to(candidateReceiveID).emit("getCandidate", {
      candidate,
      candidateSendID,
      candidateSendUserID,
      candidateReceiveID,
      candidateReceiveUserID,
    });
  });

  socket.on("reconnect", (data) => {
    console.log("reconnect", data);
    const { roomName, userId, userType } = data;
    socket.join(roomName);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    if (users[roomName]) {
      users[roomName].push({ id: socket.id, userId, userType });
    }

    console.log(users[roomName]);
    io.sockets.to(socket.id).emit("allUsers", users[roomName]);
  });

  socket.on("disconnect", (reason) => {
    console.log("disconnect", reason);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);

    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((user) => user.id !== socket.id);
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }

    console.log("remain users", users);
    socket.to(roomID).emit("userExit", { id: socket.id });
  });

  // ???
  socket.on("clear", () => {
    console.log("clear", socket.id);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    console.log("room", room);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
