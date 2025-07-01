import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ProjectModal from "./models/project.model.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // or whatever your client origin is
  },
});

io.use(async (socket, next) => {
  //console.log("kuku" + socket.handshake.headers.authorization?.split(" ")[1]);

  const token =
    socket.handshake.auth.token ||
    socket.handshake.headers.authorization?.split(" ")[1];

  const projectId = socket.handshake.query.projectId;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return next(new Error("invalid projectId"));
  }

  socket.project = await ProjectModal.findById(projectId).lean();

  if (!token) {
    return next(new Error("NO TOKEN"));
  }

  const user = jwt.verify(token, process.env.JWT_SECRET);

  if (!user) {
    return next(new Error("Auth Error"));
  }

  socket.user = user;

  next();
});

io.on("connection", (socket) => {
  console.log("User has connected", socket.user.email);
  socket.roomId = socket.project._id.toString();

  socket.join(socket.roomId);

  socket.on("project-message", (data) => {
    console.log(data);
    const messgeData = {
      ...data,
      sender: socket.user.email,
    };
    socket.broadcast.to(socket.roomId).emit("project-message", messgeData);
  });

  socket.on("disconnect", () => {
    socket.leave(socket.roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
