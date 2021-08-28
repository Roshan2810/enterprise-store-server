const express = require("express");
const redis = require("redis");
const { REDIS_HOSTNAME, REDIS_PORT } = require("./config/connectionDetails");
const subscriber = redis.createClient({
  port: REDIS_PORT,
  host: "redis-server",
});
const app = express();
console.log("redis config" ,REDIS_HOSTNAME,REDIS_PORT);

const { getDataFromRedis, setDataInRedis } = require("./util");
subscriber.on("message", async (channel, message) => {
  try {
    let parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    await setDataInRedis(
      `${parsedMessage.cartId}-preExpiredData`,
      parsedMessage
    );
  } catch (error) {
    let preExpiredData = await getDataFromRedis(`${message}-preExpiredData`);
    if (preExpiredData.cartId === message) {
      const existingData = await getDataFromRedis("productDetails");
      let preExpiredObj = {};
      for (let i = 0; i < preExpiredData.productId.length; i++) {
        if (preExpiredObj.hasOwnProperty(preExpiredData.productId[i])) {
          preExpiredObj[preExpiredData.productId[i]]++;
        } else {
          console.log("inside else");
          preExpiredObj[preExpiredData.productId[i]] = 1;
        }
      }

      let updatedData = existingData.map((data) => {
        if (preExpiredObj.hasOwnProperty(data.productId)) {
          data.quantity = data.quantity + preExpiredObj[data.productId];
        }
        return data;
      });

      let result = await setDataInRedis("productDetails", updatedData);
    }
  }
});

subscriber.subscribe("__keyevent@0__:expired");
app.listen(3006, () => {
  console.log("server is listening to port 3006");
});
