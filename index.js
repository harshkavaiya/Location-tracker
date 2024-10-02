require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

const http = require("http");
const socketio = require("socket.io");

const PORT = process.env.PORT || 3000;

// Create server
const server = http.createServer(app);
const io = socketio(server);

app.set("views", path.join(__dirname, "views"));

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

app.get("/test", (req, res) => {
  res.send("This is a test route.");
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
