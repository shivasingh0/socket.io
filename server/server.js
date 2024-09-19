import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  console.log("Hello World");
});


io.on("connection", (socket) => {
  console.log("User connected");
  console.log(`User Socket Id: ${socket.id}`);
  socket.emit("welcome", "Welcome to the server");
  socket.broadcast.emit("welcome", `${socket.id} joined the server`);

  socket.on("message", ({ message, room }) => {
    console.log({ message, room });
    // socket.broadcast.emit("receive-message", message);
    io.to(room).emit("receive-message", message); // when using to() then u can use socket or io it doesn't matter
  });

  socket.on("join-room", (room) => {
    console.log(`User joined ${room}`);
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(9000, () => {
  console.log("Server is running on port 9000");
});
