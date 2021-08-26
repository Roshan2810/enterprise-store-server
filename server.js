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
const {
  setDataInRedis,
  getDataFromRedis,
  deleteDataFromRedis,
} = require("./util");
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

app.get("/product/getCampaignProducts", async(req, res) => {
  try {
    let productList = await getDataFromRedis("products");
    res.send({
        success: true,
        status: 200,
      data: productList,
    });
  } catch (err) {
    return res.send({
      success: false,
      message: err,
    });
  }
});

app.get("/product/getProductDetails/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    let productList = await getDataFromRedis("productDetails");
    let productData = productList.filter(
        (data) => data.productId === productId
      );
    if(productData.length){
      res.send({ 
        status: 200,
        data: productData
    });
    }else{
      res.statusCode = 404;
       res.send({
         status: 404,
         message: "Product ID Not Found.",
        })
    }
  } catch (err) {
    return res.send({
      success: false,
      message: err,
    });
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
      const cartInfo = { productId, cartId };
      await setDataInRedis(cartId, cartInfo);
      client.expire(cartId, 10);
      client.publish("__keyevent@0__:expired", JSON.stringify(cartInfo));
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

app.post("/product/productCheckedOut", async (req, res) => {
  try {
    const { cartId, userId } = req.body;
    let cartData = await getDataFromRedis(cartId);
    if (cartData !== null) {
      res.send({
        status: 200,
        message: "Checkout successful",
      });
      await deleteDataFromRedis(cartId);
    } else if (cartData === null) {
      res.statusCode = 400;
      res.send({
        status: 400,
        message: "Checkout unsuccessful",
      });
    }
  } catch (err) {
    return res.send({
      success: false,
      message: err,
    });
  }
});

console.log("listening to port 3001");
app.listen(3001);
