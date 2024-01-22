"use strict";

require("regenerator-runtime");
var _http = _interopRequireDefault(require("http"));
var _socket = _interopRequireDefault(require("socket.io"));
var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", _express["default"]["static"](__dirname + "/public"));
app.get("/", function (_, res) {
  return res.render("home");
});
app.get("/*", function (_, res) {
  return res.redirect("/");
});
var httpServer = _http["default"].createServer(app);
var io = (0, _socket["default"])(httpServer, {
  cors: {
    origin: "*"
  }
});

// global values
var MAXIMUM = process.env.SOCKET_ROOM_MAXIMUM || 30;
var users = {};
var socketToRoom = {};
io.on("connection", function (socket) {
  socket.on("joinRoom", function (data) {
    console.log("joinRoom", data);
    if (users[data.roomName]) {
      var length = users[data.roomName].length;
      if (length === MAXIMUM) {
        socket.to(socket.id).emit("room_full");
        return;
      }
      users[data.roomName].push({
        id: socket.id,
        userId: data.userId,
        userType: data.userType
      });
    } else {
      if (data.userType === "teacher") {
        users[data.roomName] = [{
          id: socket.id,
          userId: data.userId,
          userType: data.userType
        }];
      } else {
        // 방이 없는데 학생이 들어오면 방이 없다고 알려주기
        console.log("roomNotExist");
        io.sockets.to(socket.id).emit("roomNotExist", {
          roomName: data.roomName
        });
        return;
      }
    }
    socketToRoom[socket.id] = data.roomName;
    socket.join(data.roomName);
    console.log("[".concat(socketToRoom[socket.id], "]: ").concat(socket.id, " enter"));
    var usersInThisRoom = users[data.roomName].filter(function (user) {
      return user.id !== socket.id;
    });
    console.log("usersInThisRoom", usersInThisRoom);
    io.sockets.to(socket.id).emit("allUsers", usersInThisRoom);
  });
  socket.on("offer", function (data) {
    // console.log("offer", data);
    var sdp = data.sdp,
      offerSendID = data.offerSendID,
      offerSendUserId = data.offerSendUserId,
      offerUserType = data.offerUserType,
      offerReceiveID = data.offerReceiveID;
    socket.to(offerReceiveID).emit("getOffer", {
      sdp: sdp,
      offerSendID: offerSendID,
      offerSendUserId: offerSendUserId,
      offerUserType: offerUserType
    });
  });
  socket.on("answer", function (data) {
    // console.log("answer", data);
    var sdp = data.sdp,
      answerSendID = data.answerSendID,
      answerSendUserId = data.answerSendUserId,
      answerReceiveID = data.answerReceiveID;
    socket.to(answerReceiveID).emit("getAnswer", {
      sdp: sdp,
      answerSendID: answerSendID,
      answerSendUserId: answerSendUserId
    });
  });
  socket.on("candidate", function (data) {
    // console.log("socket on candidate", data);
    var candidate = data.candidate,
      candidateSendID = data.candidateSendID,
      candidateSendUserID = data.candidateSendUserID,
      candidateReceiveID = data.candidateReceiveID,
      candidateReceiveUserID = data.candidateReceiveUserID;
    socket.to(candidateReceiveID).emit("getCandidate", {
      candidate: candidate,
      candidateSendID: candidateSendID,
      candidateSendUserID: candidateSendUserID,
      candidateReceiveID: candidateReceiveID,
      candidateReceiveUserID: candidateReceiveUserID
    });
  });
  socket.on("reconnect", function (data) {
    console.log("reconnect", data);
    var roomName = data.roomName,
      userId = data.userId,
      userType = data.userType;
    socket.join(roomName);
    console.log("[".concat(socketToRoom[socket.id], "]: ").concat(socket.id, " enter"));
    if (users[roomName]) {
      users[roomName].push({
        id: socket.id,
        userId: userId,
        userType: userType
      });
    }
    console.log(users[roomName]);
    io.sockets.to(socket.id).emit("allUsers", users[roomName]);
  });
  socket.on("disconnect", function (reason) {
    console.log("disconnect", reason);
    console.log("[".concat(socketToRoom[socket.id], "]: ").concat(socket.id, " exit"));
    var roomID = socketToRoom[socket.id];
    var room = users[roomID];
    if (room) {
      room = room.filter(function (user) {
        return user.id !== socket.id;
      });
      users[roomID] = room;
      if (room.length === 0) {
        delete users[roomID];
        return;
      }
    }
    console.log("remain users", users);
    socket.to(roomID).emit("userExit", {
      id: socket.id
    });
  });

  // ???
  socket.on("clear", function () {
    console.log("clear", socket.id);
    var roomID = socketToRoom[socket.id];
    var room = users[roomID];
    console.log("room", room);
  });
});
var handleListen = function handleListen() {
  return console.log("Listening on http://localhost:3000");
};
httpServer.listen(3000, handleListen);