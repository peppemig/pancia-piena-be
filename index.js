require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const healthRoutes = require("./routes/healthRoutes");
const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const statsRoutes = require("./routes/statsRoutes");
const { auth, socketAuth } = require("./middlewares/verifyTokenMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL,
  },
});

const PORT = 3000;

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors({ origin: process.env.ORIGIN_URL }));
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/products", auth, productsRoutes);
app.use("/api/v1/orders", auth, ordersRoutes);
app.use("/api/v1/stats", auth, statsRoutes);

io.use(socketAuth).on("connection", (socket) => {
  console.log("a user has connected");

  const room = `room-${socket.user}`;
  socket.join(room);

  socket.on("order-created", () => {
    io.to(room).emit("order-received");
  });

  socket.on("disconnect", () => {
    console.log("a user has disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
