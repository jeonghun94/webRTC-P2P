"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var socket = io();
var peerConnections = {};
var peerChannels = {};
var roomName = 123;
var socketId = [];
var userList = [];
var userId = "";
var userType = "";
var welcome = document.getElementById("welcome");
var welcomeForm = welcome.querySelector("form");
var student = document.getElementById("student");
var studentForm = student.querySelector("form");
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
  socket.emit("join_room", {
    roomName: roomName,
    userId: userId,
    userType: userType
  });
}
function handleWelcomeSubmit(event) {
  event.preventDefault();
  resetConnections();
  userId = "teacher" + Math.floor(Math.random() * 1000000);
  userType = "teacher";
  welcome.hidden = true;
  socket.emit("join_room", {
    roomName: roomName,
    userId: userId,
    userType: userType
  });
}
function createPeerConnection(id, remoteUserId, localUserId) {
  try {
    var pc = new RTCPeerConnection({
      iceServers: [{
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302", "stun:stun3.l.google.com:19302", "stun:stun4.l.google.com:19302"]
      }]
    });
    pc.onicecandidate = function (e) {
      if (!(socket && e.candidate)) {
        return;
      }
      socket.emit("candidate", {
        candidate: e.candidate,
        candidateSendID: socket.id,
        candidateSendUserID: localUserId,
        candidateReceiveID: id,
        candidateReceiveUserID: remoteUserId
      });
    };
    pc.ontrack = function (e) {
      userList = userList.filter(function (user) {
        return user.id !== id;
      }).concat({
        id: id,
        remoteUserId: remoteUserId,
        stream: e.streams[0]
      });
    };
    return pc;
  } catch (e) {
    console.error(e);
    return;
  }
}
var sendMessageAll = function sendMessageAll(message) {
  for (var _i = 0, _Object$entries = Object.entries(peerChannels); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      channel = _Object$entries$_i[1];
    console.log("".concat(userType === "teacher" ? "학생" : "선생님", "(").concat(key, ")\uC5D0\uAC8C \uBA54\uC2DC\uC9C0 ").concat(message, "\uB97C \uBCF4\uB0C5\uB2C8\uB2E4."));
    try {
      channel.send(JSON.stringify(message));
    } catch (e) {
      console.error("sendMessage error", e);
    }
  }
};
var sendMessage = function sendMessage(message, user) {
  var channel = user ? peerChannels[user.userId] : peerChannels[userList[0].userId];
  if (!channel) {
    console.error("not found channer", user);
    return;
  }
  console.log(user ? "\uC120\uC0DD\uB2D8\uC774 \uD559\uC0DD(".concat(user.userId, ")\uC5D0\uAC8C \uBA54\uC2DC\uC9C0 ").concat(message, "\uB97C \uBCF4\uB0C5\uB2C8\uB2E4.") : "\uC120\uC0DD\uB2D8\uC774 \uD559\uC0DD(".concat(userList[0].userId, ")\uC5D0\uAC8C \uBA54\uC2DC\uC9C0 ").concat(message, "\uB97C \uBCF4\uB0C5\uB2C8\uB2E4."));
  channel.send(JSON.stringify(message));
};
socket.on("all_users", function (users) {
  console.log("all_users", users);
  users.forEach( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(user) {
      var pc, channel, offer;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(user.userType === "student")) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            pc = createPeerConnection(user.id, user.userId, userId);
            if (pc && socket && socket.connected) {
              _context.next = 5;
              break;
            }
            return _context.abrupt("return");
          case 5:
            channel = pc.createDataChannel("chat");
            channel.onopen = function () {
              console.log("\uC120\uC0DD\uB2D8(".concat(user.userId, ")\uACFC \uC5F0\uACB0\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
            };
            channel.onclose = function () {
              console.log("\uC120\uC0DD\uB2D8(".concat(user.userId, ")\uACFC \uC5F0\uACB0\uC774 \uB04A\uC5B4\uC84C\uC2B5\uB2C8\uB2E4."));
            };
            channel.onmessage = function (event) {
              if (!event.data) return;
              var recvMessage = JSON.parse(event.data);
              console.log("\uC120\uC0DD\uB2D8(".concat(user.userId, ")\uB85C\uBD80\uD130 \uBA54\uC2DC\uC9C0 ").concat(recvMessage, "\uB97C \uBC1B\uC558\uC2B5\uB2C8\uB2E4."));
            };
            peerConnections[user.userId] = pc;
            peerChannels[user.userId] = channel;
            userList.push({
              id: user.id,
              userId: user.userId,
              userType: userType
            });
            _context.next = 14;
            return pc.createOffer({
              iceRestart: true
            });
          case 14:
            offer = _context.sent;
            _context.next = 17;
            return pc.setLocalDescription(offer);
          case 17:
            socket.emit("offer", {
              sdp: pc.localDescription,
              offerSendID: socket.id,
              offerSendUserId: userId,
              offerUserType: userType,
              offerReceiveID: user.id
            });
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
});

// Peer B's code
socket.on("getOffer", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(offer) {
    var sdp, offerSendID, offerSendUserId, offerUserType, pc, answer;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          sdp = offer.sdp, offerSendID = offer.offerSendID, offerSendUserId = offer.offerSendUserId, offerUserType = offer.offerUserType;
          pc = createPeerConnection(offerSendID, offerSendUserId, userId);
          if (pc && socket && socket.connected) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return");
        case 4:
          peerConnections[offerSendUserId] = pc;
          _context2.next = 7;
          return pc.setRemoteDescription(sdp);
        case 7:
          _context2.next = 9;
          return pc.createAnswer();
        case 9:
          answer = _context2.sent;
          _context2.next = 12;
          return pc.setLocalDescription(answer);
        case 12:
          socket.emit("answer", {
            sdp: pc.localDescription,
            answerSendID: socket.id,
            answerSendUserId: userId,
            answerReceiveID: offerSendID
          });
          pc.ondatachannel = function (event) {
            peerChannels[offerSendUserId] = event.channel;
            userList.push({
              id: offerSendID,
              userId: offerSendUserId,
              userType: offerUserType
            });
            event.channel.onopen = function () {
              console.log("\uD559\uC0DD(".concat(offerSendUserId, ")\uACFC \uC5F0\uACB0\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));

              // console.log("학생과 연결되었습니다.", {
              //   id: offerSendID,
              //   userId: offerSendUserId,
              //   userType: offerUserType,
              // });
            };
            event.channel.onclose = function () {
              userList = userList.filter(function (user) {
                return user.id !== offerSendID;
              });
              console.log("\uD559\uC0DD(".concat(offerSendUserId, ")\uACFC \uC5F0\uACB0\uC774 \uB04A\uC5B4\uC84C\uC2B5\uB2C8\uB2E4."));

              // console.log("학생과 연결이 끊어졌습니다.", {
              //   id: offerSendID,
              //   userId: offerSendUserId,
              //   userType: offerUserType,
              // });
            };
            event.channel.onmessage = function (event) {
              if (!event.data) return;
              var recvMessage = JSON.parse(event.data);
              console.log("\uD559\uC0DD(".concat(offerSendUserId, ")\uC73C\uB85C\uBD80\uD130 \uBA54\uC2DC\uC9C0(").concat(recvMessage, ")\uB97C \uBC1B\uC558\uC2B5\uB2C8\uB2E4."));
            };
          };
        case 14:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
socket.on("getAnswer", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(answer) {
    var sdp, answerSendID, answerSendUserId, pc;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          sdp = answer.sdp, answerSendID = answer.answerSendID, answerSendUserId = answer.answerSendUserId;
          pc = peerConnections[answerSendUserId];
          if (pc && socket && socket.connected) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return");
        case 4:
          _context3.next = 6;
          return pc.setRemoteDescription(sdp);
        case 6:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
socket.on("getCandidate", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
    var candidate, candidateSendID, candidateSendUserID, candidateReceiveID, candidateReceiveUserID, pc;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          candidate = data.candidate, candidateSendID = data.candidateSendID, candidateSendUserID = data.candidateSendUserID, candidateReceiveID = data.candidateReceiveID, candidateReceiveUserID = data.candidateReceiveUserID;
          pc = peerConnections[candidateSendUserID];
          if (pc) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return");
        case 4:
          _context4.next = 6;
          return pc.addIceCandidate(candidate);
        case 6:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());
socket.on("user_exit", function (user) {
  console.log("user_exit", user);
  // 선생은 학생이 나가면 학생을 지워야함 추가 확인 필요
  if (user.userType !== "teacher") return;
  userList = userList.filter(function (user) {
    return user.id !== user.id;
  });
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