const express = require("express");
const app = express();
const path = require("path");

const http = require("http");
const socketio = require("socket.io");

// Create server
const server = http.createServer(app);
const io = socketio(server);

// Set view engine
app.set("view engine", "ejs");
const users = {};
// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Socket.io connection

io.on("connection", (socket) => {
  socket.on("send-loca", (data) => {
    io.emit("receive-loca", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    console.log("remove");
    io.emit("user-exit", socket.id);
  });
});

// Basic route
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
server.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
