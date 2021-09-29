const Redis = require("ioredis");
const redis = new Redis(6379, "172.17.0.1");

const getRedis = () => redis;

module.exports = {
    getRedis
}