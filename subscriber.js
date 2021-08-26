const express = require("express");
const redis = require("redis");
const subscriber = redis.createClient();
const app = express();
const { getDataFromRedis, setDataInRedis } = require("./util");
subscriber.on("message", async (channel, message) => {
  try {
    let parsedMessage = JSON.parse(message);
    await setDataInRedis("preExpiredData", parsedMessage);
  } catch (error) {
    let preExpiredData = await getDataFromRedis("preExpiredData");
    if (preExpiredData.cartId === message) {
      const existingData = await getDataFromRedis("productDetails");
      const updatedData = existingData.map((product) => {
        if (product.productId === preExpiredData.productId) {
          product.quantity++;
        }
        return product;
      });
      let result = await setDataInRedis("productDetails", updatedData);
      console.log(result);
    }
  }
});

subscriber.subscribe("__keyevent@0__:expired");
app.listen(3006, () => {
  console.log("server is listening to port 3006");
});
