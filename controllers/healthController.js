const prisma = require("../config/prisma");
const redis = require("../config/redis");

const getHealth = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Health check failed: ", error);
    res.status(503).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = getHealth;
