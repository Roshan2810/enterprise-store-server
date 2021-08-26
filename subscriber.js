const express = require("express");
const redis = require("redis");
const subscriber = redis.createClient();
const app = express();
const { getDataFromRedis, setDataInRedis } = require("./util");
subscriber.on("message", async (channel, message) => {
  if (message) {
    const data = await getDataFromRedis("productDetails");
    const updatedData = data.map((product) => {
      if (product.productId === message) product.quantity++;
      return product;
    });
    let result = await setDataInRedis("productDetails", updatedData);
    console.log(result);
  }
});

subscriber.subscribe("__keyevent@0__:expired");
app.listen(3006, () => {
  console.log("server is listening to port 3006");
});
