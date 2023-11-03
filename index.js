require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const authMiddleware = require("./middlewares/verifyTokenMiddleware");

const app = express();
const PORT = 3000;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/products", authMiddleware, productsRoutes);
app.use("/api/v1/orders", authMiddleware, ordersRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
