const Redis = require("ioredis");
const { stringify } = require("uuid");
const redis = new Redis({
  host: "localhost",
  port: "6379",
});
async function getDataFromRedis(key) {
  let data = await redis.get(key);
  return JSON.parse(data);
}

async function setDataInRedis(key, value) {
  let response = await redis.set(key, JSON.stringify(value));
  return response;
}

module.exports = {
  getDataFromRedis,
  setDataInRedis,
};
