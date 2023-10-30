const prisma = require("../config/prisma");

const createProduct = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { name, price } = req.body;

    const product = await prisma.product.create({
      data: {
        name: name,
        price: price,
        userId: userId,
      },
    });

    res.status(200).json({
      success: "true",
      product,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const getProducts = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const products = await prisma.product.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: "true",
      products,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

module.exports = { createProduct, getProducts };
