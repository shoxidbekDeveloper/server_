const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
const cors = require("cors");
dotenv.config();
const socketIo = require("socket.io");
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
io.on("connection", (socket) => {
  console.log(`user connected id: ${socket?.id}`);

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("message", ({ message, room }) => {
    socket.to(room).emit("respone_message", message);
  });
});
// server.listen(port, () => console.log(`Listening on port ${port}`));
module.exports.handler = serverless(app);
