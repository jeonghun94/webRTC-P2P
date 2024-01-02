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
  socket.on("join_room", (data) => {
    console.log("join_room", data);

    if (users[data.room]) {
      const length = users[data.room].length;

      if (length === MAXIMUM) {
        socket.to(socket.id).emit("room_full");
        return;
      }

      users[data.room].push({
        id: socket.id,
        userId: data.userId,
        userType: data.userType,
      });
    } else {
      users[data.room] = [
        { id: socket.id, userId: data.userId, userType: data.userType },
      ];
    }

    socketToRoom[socket.id] = data.room;

    socket.join(data.room);
    console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

    let usersInThisRoom = users[data.room].filter(
      (user) => user.id !== socket.id
    );

    console.log("usersInThisRoom", usersInThisRoom);
    io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
  });

  socket.on("offer", (data) => {
    // console.log("socket on offer", data.sdp);
    const { sdp, offerSendID, offerSendUserId, offerUserType, offerReceiveID } =
      data;
    console.log("offer", data);
    socket
      .to(offerReceiveID)
      .emit("getOffer", { sdp, offerSendID, offerSendUserId, offerUserType });
  });

  socket.on("answer", (data) => {
    // console.log("socket on answer", data.sdp);
    console.log("answer", data);
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

    console.log("users", users);

    socket.to(roomID).emit("user_exit", { id: socket.id });
    console.log("remain users", users);
  });

  // 해야할 듯?
  socket.on("clear", () => {
    console.log("clear", socket.id);
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    console.log("room", room);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
