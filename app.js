const express = require("express");
const middelware = require("./utils/midleware");
const { MongoClient } = require("mongodb");

const DB_URI =
  "mongodb+srv://admin:eKrs4pV1H3EMejcb@cluster0.n0tzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(DB_URI);

const app = express();

// app.use(function(req,res,next){
// const date=new Date()
// if(date.getDay()>5 || date.getHours()>21 || date.getHours()<9 ){
//     res.send('access denied')
// }

// else{
//     next()
// }
// })

app.use(express.static(__dirname + "/abc"));

app.use(express.urlencoded({ extended: true }));

app.use(middelware());

app.get("/", async (req, res) => {
  try {
    var a = await client.db("mydb").collection("products").find().toArray();
    res.render("index.ejs", { products: a });
  } catch (error) {
    res.end("somthing went wrong");
  }
});

app.get("/admin", async function (req, res) {
  try {
    var a = await client.db("mydb").collection("products").find().toArray();
    res.render("admin.ejs", { products: a });
  } catch (error) {
    res.end("somthing went wrong");
  }
});

app.post("/delete/:id", async function (req, res) {
  const id = req.params.id;
  await client.db("mydb").collection("products").deleteOne({ id: +id });
  res.redirect("/admin");
});

app.get("/product/:id", async (req, res) => {
  // console.log(req.url.split('/')[2])
  console.log(req.params);
  const product = await client
    .db("mydb")
    .collection("products")
    .findOne({ id: +req.params.id });

  res.render("product.ejs", { product });
});

app.get("/update/:id", async (req, res) => {
  // console.log(req.url.split('/')[2])

  const product = await client
    .db("mydb")
    .collection("products")
    .findOne({ id: +req.params.id });

  res.render("update.ejs", { product });
});

app.post("/updateproduct/:id", async (req, res) => {
  const id = req.params.id;

 await client
    .db("mydb")
    .collection("products")
    .updateOne({ id: +id }, { $set: req.body });
  res.redirect("/admin");
});

app.get("/addproduct", (req, res) => {
  res.render("addproduct.ejs");
});

app.post("/addproduct", async (req, res) => {
  const newProduct = await client
    .db("mydb")
    .collection("products")
    .insertOne({ ...req.body, id: Math.floor(Math.random() * 1000) });
  console.log("🚀 ~ app.post ~ newProduct:", newProduct);
  res.redirect("/");
});
const port = 7000;

app.listen(port, function () {
  client
    .connect()
    .then(() => console.log("connect to db"))
    .catch((e) => console.log(e));
  console.log("server running on port " + port);
});
