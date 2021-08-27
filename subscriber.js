const express = require("express");
const redis = require("redis");
const subscriber = redis.createClient();
const app = express();
const { getDataFromRedis, setDataInRedis } = require("./util");
subscriber.on("message", async (channel, message) => {
  try {
    let parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    await setDataInRedis("preExpiredData", parsedMessage);
  } catch (error) {
    let preExpiredData = await getDataFromRedis("preExpiredData");
    if (preExpiredData.cartId === message) {
      const existingData = await getDataFromRedis("productDetails");
      // const updatedData = existingData.map((product) => {
      //   return preExpiredData.productId.map((prod) => {
      //     if (product.productId === prod.productId) {
      //       product.quantity++;
      //       return product;
      //     }
      //     return product;
      //   });
      // });
      for (let i = 0; i < existingData.length; i++) {
        for (let j = 0; j < preExpiredData.productId.length; j++) {
          if (preExpiredData.productId[j] === existingData[i].productId) {
            console.log("inside loop");
            existingData[i].quantity = existingData.quantity + 1;
          }
        }
      }
      console.log(existingData);
      let result = await setDataInRedis("productDetails", existingData);
    }
  }
});

subscriber.subscribe("__keyevent@0__:expired");
app.listen(3006, () => {
  console.log("server is listening to port 3006");
});
