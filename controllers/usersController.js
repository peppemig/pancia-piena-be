const prisma = require("../config/prisma");

const createUser = async (req, res) => {
  try {
    const { id, email, name } = req.body;

    const userExists = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (userExists) {
      res.status(200).json({ success: true });
      return;
    }

    await prisma.user.create({
      data: {
        id,
        email,
        name,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

module.exports = { createUser };
