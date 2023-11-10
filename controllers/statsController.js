const prisma = require("../config/prisma");
const { format, startOfMonth, endOfMonth } = require("date-fns");
const redis = require("../config/redis");

const getStats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { year, month } = req.query;

    const cacheKey = `user:${userId}:stats:${year}:${month}`;

    const cache = await redis.get(cacheKey);

    if (cache) {
      return res.status(200).json({ success: true, stats: JSON.parse(cache) });
    }

    const monthNumber = parseInt(month);
    const yearNumber = parseInt(year);

    const firstDayOfMonth = startOfMonth(
      new Date(yearNumber, monthNumber - 1, 1)
    );
    const lastDayOfMonth = endOfMonth(new Date(yearNumber, monthNumber - 1, 1));

    const formattedFirstDayOfMonth = format(firstDayOfMonth, "yyyy-MM-dd");
    const formattedLastDayOfMonth = format(lastDayOfMonth, "yyyy-MM-dd");

    const monthTotal = await prisma.order.aggregate({
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

    const graphStats = await prisma.$queryRaw`
    SELECT date_trunc('day', "createdAt") as Day, CAST(COUNT(*) AS INTEGER) AS "ordersForTheDay"
    FROM "Order"
    WHERE "userId" = ${userId}
    AND "createdAt" >= to_timestamp(${formattedFirstDayOfMonth}, 'YYYY-MM-DD')
    AND "createdAt" <= to_timestamp(${formattedLastDayOfMonth}, 'YYYY-MM-DD')
    GROUP BY Day
    ORDER BY Day
    `;

    const last5Orders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: userId,
      },
    });

    await redis.set(
      cacheKey,
      JSON.stringify({ graphStats, monthTotal, last5Orders }),
      "EX",
      60
    );

    res.status(200).json({
      success: true,
      stats: { graphStats, monthTotal, last5Orders },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false });
  }
};

module.exports = { getStats };
