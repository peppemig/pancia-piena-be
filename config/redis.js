const { Redis } = require("ioredis");

let errorLogged = false;

const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PW,
  username: "default",
  db: 0,
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  if (!errorLogged) {
    console.error("Redis connection error:", err);
    errorLogged = true;
  }
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

module.exports = redis;
