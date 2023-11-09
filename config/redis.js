const { Redis } = require("ioredis");
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PW,
  username: "default",
  db: 0,
});
module.exports = redis;
