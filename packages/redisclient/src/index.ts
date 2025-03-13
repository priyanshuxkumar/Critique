import { createClient } from "redis";

export const redisClient = createClient();

(async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Redis connected successfully!');
    } catch (error) {
        console.log('Error occured while connecting redis',error);
        setTimeout(connectRedis, 5000);
    }
})();