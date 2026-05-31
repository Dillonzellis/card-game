import express from "express";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { Server } from "socket.io";

type Player = {
  id: string;
};

type Room = {
  id: string;
  players: Player[];
};

const rooms = new Map<string, Room>();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/health", (req, res) => {
  res.send({ ok: true });
});

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("pingServer", (msg) => {
    console.log("message:", msg);
    socket.emit("pongFromServer", "from the server for realzz");
  });

  socket.on("createRoom", () => {
    const roomId = randomUUID();

    const room: Room = {
      id: roomId,
      players: [{ id: socket.id }],
    };

    rooms.set(roomId, room);

    socket.join(roomId);

    socket.emit("roomState", room);

    console.log("room created", room);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
