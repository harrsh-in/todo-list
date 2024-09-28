import express from "express";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import cors from "cors";
import router from "./router";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new SocketIOServer(server);

mongoose.connect("mongodb://admin:admin@localhost:27017/todo-list");

app.use(express.json());
app.use("/api", router);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("notification", (message) => {
    console.log(message);
    io.emit("notification", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
