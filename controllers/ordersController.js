const prisma = require("../config/prisma");

const getOrders = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const createOrder = async (req, res) => {
  const { tableNumber, orderItems } = req.body;
  const { id: userId } = req.user;
  console.log(req.body);
  console.log(userId);
  try {
    const products = await prisma.product.findMany({
      where: {
        id: orderItems.map((item) => item.productId),
      },
    });

    console.log(products);

    const totalPrice = orderItems.reduce((acc, item) => {
      const product = products.find((product) => product.id === item.productId);
      return acc + item.quantity * product.price;
    }, 0);

    console.log(totalPrice);

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

module.exports = { createOrder, getOrders };
