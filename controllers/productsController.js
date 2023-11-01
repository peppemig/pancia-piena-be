const prisma = require("../config/prisma");

const createProduct = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { name, price, category } = req.body;

    const product = await prisma.product.create({
      data: {
        name: name,
        price: price,
        userId: userId,
        category: category,
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

const editProduct = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { productId } = req.params;
    const { name, price } = req.body;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product.userId !== userId) {
      res.status(401).json({ success: false, msg: "Not authorized" });
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
      },
    });

    res.status(201).json({
      success: "true",
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product.userId !== userId) {
      res.status(401).json({ success: false, msg: "Not authorized" });
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    res.status(200).json({
      success: "true",
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

module.exports = { createProduct, getProducts, deleteProduct, editProduct };
