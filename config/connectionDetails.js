const REDIS_PORT = process.env.REDIS_PORT ? process.env.REDIS_PORT : "6379";
const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME
  ? process.env.REDIS_HOSTNAME
  : "127.0.0.1";

module.exports = {
  REDIS_PORT,
  REDIS_HOSTNAME,
};
