import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisclient = new Redis(process.env.REDIS_URL, {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});
try {
  redisclient.on("connect", () => {
    console.log("Redis client connected");
  });
} catch (e) {
  console.log("Redis client not connected to the server: ", e.message);
}

export default redisclient;
