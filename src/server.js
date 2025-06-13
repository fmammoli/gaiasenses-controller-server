import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "gaiasenses-5o1hyw3p4-fmammolis-projects.vercel.app", // Replace with your Next.js app URL
    methods: ["GET", "POST"],
    credentials: true,
  },
  connectionStateRecovery: {},
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("offer", (sdp) => {
    socket.broadcast.emit("getOffer", sdp);
    console.log("offer: " + socket.id);
  });

  socket.on("answer", (sdp) => {
    socket.broadcast.emit("getAnswer", sdp);
    console.log("answer: " + socket.id);
  });

  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("getCandidate", candidate);
    console.log("candidate: " + socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (_req, res) => {
  res.send("WebRTC Signaling Server is running!");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
