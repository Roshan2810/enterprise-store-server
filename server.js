const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => next());

app.get("/product/getCampaignProducts", (req, res) => {
  console.log("/product/getCampaignProducts");
  res.send({ status: 200 });
});

app.get("/product/getProductDetails/:productId", (req, res) => {
  console.log("/product/getProductDetails/:productId");
  res.send({ status: 200 });
});

app.post("/product/addToCart", (req, res) => {
  console.log("/product/addToCart");
  res.send({ status: 200 });
});

app.post("/product/productCheckedOut", (req, res) => {
  console.log("/product/productCheckedOut");
  res.send({ status: 200 });
});

console.log("listening to port 3001");
app.listen(3001);
