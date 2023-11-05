const prisma = require("../config/prisma");
const {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} = require("date-fns");

const getStats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { year, month, day } = req.query;

    const monthNumber = parseInt(month);
    const yearNumber = parseInt(year);
    const dayNumber = parseInt(day);

    const firstDayOfMonth = startOfMonth(
      new Date(yearNumber, monthNumber - 1, 1)
    );
    const lastDayOfMonth = endOfMonth(new Date(yearNumber, monthNumber - 1, 1));

    const startOfDayDate = startOfDay(
      new Date(yearNumber, monthNumber - 1, dayNumber)
    );
    const endOfDayDate = endOfDay(
      new Date(yearNumber, monthNumber - 1, dayNumber)
    );

    const formattedFirstDayOfMonth = format(firstDayOfMonth, "yyyy-MM-dd");
    const formattedLastDayOfMonth = format(lastDayOfMonth, "yyyy-MM-dd");

    const monthlyStats = await prisma.order.aggregate({
      _count: true,
      _sum: {
        totalPrice: true,
      },
      where: {
        userId: userId,
        createdAt: {
          gte: new Date(formattedFirstDayOfMonth),
          lte: new Date(formattedLastDayOfMonth),
        },
      },
    });

    const dailyOrders = await prisma.order.count({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfDayDate,
          lte: endOfDayDate,
        },
      },
    });

    const last5Orders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: userId,
      },
    });

    res
      .status(200)
      .json({
        success: true,
        stats: { monthlyStats, dailyOrders, last5Orders },
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

module.exports = { getStats };
