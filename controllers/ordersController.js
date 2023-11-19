const prisma = require("../config/prisma");

const getOrders = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const orders = await prisma.order.findMany({
      where: {
        isCompleted: false,
        userId: userId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const getCompletedOrdersPaginated = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const page = parseInt(req.query.page);
    const perPage = 20;

    const totalItems = await prisma.order.count({
      where: {
        isCompleted: true,
        userId: userId,
      },
    });

    const totalPages = Math.ceil(totalItems / perPage);

    const orders = await prisma.order.findMany({
      where: {
        isCompleted: true,
        userId: userId,
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, ordersData: { orders, totalPages } });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { orderId } = req.params;

    await prisma.order.delete({
      where: {
        userId: userId,
        id: orderId,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const setOrderToCompleted = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { orderId } = req.params;

    await prisma.order.update({
      where: {
        userId: userId,
        id: orderId,
      },
      data: {
        isCompleted: true,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

const createOrder = async (req, res) => {
  try {
    const { tableNumber, orderItems } = req.body;
    const { id: userId } = req.user;

    const products = await prisma.product.findMany({
      where: {
        userId: userId,
        id: {
          in: orderItems.map((item) => item.productId),
        },
      },
    });

    const totalPrice = orderItems.reduce((acc, item) => {
      const product = products.find((product) => product.id === item.productId);
      return acc + item.quantity * product.price;
    }, 0);

    await prisma.order.create({
      data: {
        tableNumber: tableNumber,
        totalPrice: totalPrice,
        userId: userId,
        orderItems: {
          create: orderItems.map((item) => ({
            quantity: item.quantity,
            productId: item.productId,
          })),
        },
      },
      include: { orderItems: true },
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

module.exports = {
  createOrder,
  getOrders,
  deleteOrder,
  setOrderToCompleted,
  getCompletedOrdersPaginated,
};
