const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const redis = require("redis");
const client = redis.createClient();
const redisData = require("./example")
const httperror = require("http-errors")

// client.set(
//   "products",
//   JSON.stringify({redisData }),
//   (err, reply) => {
//     console.log(reply, err);
//   }
// );
app.use(bodyParser.json());

app.use((req, res, next) => next());

app.get("/product/getCampaignProducts", (req, res) => {
  try{
  client.get("products", (err, result) => {
      return res.send({
        success: true,
        status: 200,
        data: result
      });
  });
}catch(err){
  return res.send({
    success: false,
    message: err,
  });

}
});

app.get("/product/getProductDetails/:productId", (req, res) => {
  try{
  const product = req.params.productId;
  
  client.get("products",(err, result) => {
    console.log(result)
        res.send({ status: 200 ,data: JSON.parse(result)});
  });
  }catch(err){
    console.log(err)
  }

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
