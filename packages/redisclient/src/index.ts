import { createClient } from "redis";

const redisClient = createClient();

(async function connectRedis() {
  redisClient.on("error", (err) => {
    console.error("Redis client error", err);
  });

  redisClient.on("ready", () => {
    console.log("Redis client connected");
  });

  await redisClient.connect();

  await redisClient.ping();
})();

export { redisClient };
