const Redis = require("ioredis");
const redis = new Redis();
async function getDataFromRedis(key) {
  let data = await redis.get(key);
  return JSON.parse(data);
}

async function setDataInRedis(key, value) {
  let response = await redis.set(key, JSON.stringify(value));
  return response;
}

async function deleteDataFromRedis(key) {
  let response = await redis.del(key);
  return response;
}

module.exports = {
  getDataFromRedis,
  setDataInRedis,
  deleteDataFromRedis,
};
