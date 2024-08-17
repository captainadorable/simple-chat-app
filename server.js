const express = require("express");
const app = express();
const server = require("http").Server(app);
const { Server } = require("socket.io");
const io = new Server(server);

const hostSecret = process.env["HOST"] || "http://localhost:3000";
const { v4: uuidv4, validate } = require("uuid");

const Rooms = require("./classes/Rooms");
const Room = require("./classes/Room");
const User = require("./classes/User");

const MyRooms = new Rooms();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/portal", (req, res) => {
	res.render("portal", { Rooms: MyRooms.GetPublicRooms() });
});

app.get("/createRoom", (req, res) => {
	let roomId = uuidv4();
	MyRooms.CreateRoom(
		new Room(
			roomId,
			req.query.roomName,
			req.query.isPrivate,
			hostSecret + `/rooms/${roomId}`
		)
	);
	console.log(MyRooms.rooms);
	res.redirect(`/rooms/${roomId}?userName=${req.query.userName}`);
});

app.get("/roomNotFound", (req, res) => {
	res.render("roomNotFound");
});

app.get("/getUserName", (req, res) => {
	const { redirectTo } = req.query;
	let valid = validate(redirectTo);

	if (!redirectTo) return res.redirect("/");
	if (!valid) return res.redirect("/");

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

// SOCKET.IO
io.on("connection", (socket) => {
	socket.on("joinRoom", (roomId, userName) => {
		let user = new User(socket.id, userName);

		if (MyRooms.GetRoomFromId(roomId)) {
			socket.join(roomId);
			MyRooms.GetRoomFromId(roomId).AddUser(user);
			console.log("join-room", roomId, user);
		} else {
			socket.emit("room error");
			return;
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
