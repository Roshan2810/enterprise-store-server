const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const cors = require("cors");
const app = express();
const client = redis.createClient();
const redisData = require("./products");
const productDetailInfo = require("./productDetails");
const httperror = require("http-errors");
const { v4: uuidv4, parse } = require("uuid");
const { setDataInRedis, getDataFromRedis } = require("./util");
let parsedData;
app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => next());

const generateProductId = (redisData) => {
  redisData = redisData.map((entry) => {
    entry.productId = uuidv4();
    return entry;
  });
  return redisData;
};

client.set(
  "products",
  JSON.stringify(generateProductId(redisData)),
  (err, reply) => {
    console.log(reply, err);
  }
);

const getProductDetails = () => {
  return productDetailInfo.map((product, i) => {
    product.productId = redisData[i].productId;
    return product;
  });
};

client.set(
  "productDetails",
  JSON.stringify(getProductDetails()),
  (err, reply) => {
    console.log(reply, err);
  }
);

app.get("/product/getCampaignProducts", (req, res) => {
  try {
    client.get("products", (err, result) => {
      return res.send({
        success: true,
        status: 200,
        data: JSON.parse(result),
      });
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err,
    });
  }
});

app.get("/product/getProductDetails/:productId", (req, res) => {
  try {
    const { productId } = req.params;
    client.get("productDetails", (err, result) => {
      let parsedResult = JSON.parse(result);
      let resp_data = parsedResult.filter(
        (data) => data.productId === productId
      );
      res.send({ status: 200, data: resp_data });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/product/addToCart", async (req, res) => {
  const { productId, userId } = req.body;
  if (productId && userId) {
    let existingData = await getDataFromRedis("productDetails");
    let count = existingData.filter(
      (val) => val.productId === productId && val.quantity > 0
    ).length;
    if (count) {
      const updatedData = existingData.map((data) => {
        if (productId === data.productId) {
          data.quantity--;
        }
        return data;
      });
      await setDataInRedis("productDetails", updatedData);
      const cartId = uuidv4();
      const cartInfo = { userId, cartId };
      client.set(productId, JSON.stringify(cartInfo));
      client.expire(productId, 10);
      client.publish("__keyevent@0__:expired", "");
      res.send({
        status: 200,
        message: "Added to cart successfully",
        data: {
          cartId,
        },
      });
    } else {
      res.statusCode = 400;
      res.send({
        status: 400,
        message: "Item is out of stock",
      });
    }
  } else {
    res.statusCode = 400;
    res.send({
      status: 400,
      message: "Add to cart failed, no product ids were found",
    });
  }
});

app.post("/product/productCheckedOut", (req, res) => {
  try {
    const { cartId, userId } = req.body;
    client.get(userId, (err, reply) => {
      if (!reply) {
        res.statusCode = 404;
        return res.send({
          status: 404,
          message: "No User ID Found.",
        });
      }
      let result = JSON.parse(reply);
      if (result.cartId === cartId) {
        res.send({
          status: 200,
          message: "Checkout successful",
        });
        client.del(userId, (err, reply) => {
          console.log("Redis Del", reply);
        });
      } else {
        res.statusCode = 404;
        return res.send({
          status: 404,
          message: "No Cart ID Found.",
        });
      }
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err,
    });
  }
});

console.log("listening to port 3001");
app.listen(3001);
