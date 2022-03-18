const express = require("express");
const app = express();
const server = require("http").Server(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config()

const { v4: uuidv4 } = require("uuid");

const Rooms = require("./classes/Rooms");
const Room = require("./classes/Room");
const User = require("./classes/User");

const MyRooms = new Rooms();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { MyRooms: MyRooms });
});

app.get('/createRoom', (req, res) => {
  res.redirect(`/getUserName?redirectTo=${uuidv4()}`);
})

app.get("/getUserName", (req, res) => {
  if (!req.query.redirectTo) return req.redirect("/");
  res.render("getUsername", { redirectTo: req.query.redirectTo });
});

app.get("/rooms/:room", (req, res) => {
  if (!req.query.userName)
    return res.redirect(`/getUserName?redirectTo=${req.params.room}`);
  res.render("chatRoom", {
    roomId: req.params.room,
    userName: req.query.userName,
  });
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId, userName) => {
    let user = new User(socket.id, userName);

    console.log("join-room", roomId, user);

    socket.join(roomId);

    if (!MyRooms.GetRoomFromId(roomId)) {
      MyRooms.CreateRoom(new Room(roomId, user, process.env.HOST + `/rooms/${roomId}`));
    } else {
      MyRooms.GetRoomFromId(roomId).AddUser(user);
    }
    console.log("Active rooms", MyRooms.rooms);

    io.to(roomId).emit("new user", userName);
  });

  socket.on("chat message", (userName, message, roomId) => {
    io.to(roomId).emit("chat message", userName, message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected.", socket.id);
    let room = MyRooms.GetRoomFromUserId(socket.id);
    if (room) {
      room.RemoveUser(socket.id);
    }
    MyRooms.RemoveEmptyRooms();
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Listening port 3000");
});
