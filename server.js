const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const cors = require("cors");
const app = express();
const client = redis.createClient();
const redisData = require("./example");
const httperror = require("http-errors");
const { v4: uuidv4 } = require("uuid");

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => next());

const generateProductId = (redisData) => {
  return redisData.map((entry) => {
    entry.productId = uuidv4();
    return entry;
  });
};

client.set(
  "products",
  JSON.stringify(generateProductId(redisData)),
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
    const product = req.params.productId;

    client.get("products", (err, result) => {
      console.log(result);
      res.send({ status: 200, data: JSON.parse(result) });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/product/addToCart", (req, res) => {
  const { productIds, userId } = req.body;
  if (productIds.length && userId) {
    const cartId = uuidv4();
    client.set(userId, JSON.stringify({ productIds, cartId }));
    res.send({
      status: 200,
      data: {
        cartId,
      },
    });
  } else {
    res.statusCode = 400;
    res.send({
      status: 400,
      message: "Add to cart failed, no product ids were found",
    });
  }
});

app.post("/product/productCheckedOut", (req, res) => {
  const { cartId, userId } = req.body;
  client.get(userId, (err, reply) => {
    if (reply.cartId === cartId) {
      res.send({
        status: 200,
        message: "Checkout successful",
      });
    } else {
      res.statusCode = 400;
      res.send({
        status: 400,
        message: "Checkout unsuccessful",
      });
    }
  });
});

console.log("listening to port 3001");
app.listen(3001);
