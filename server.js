const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express();
// declare variable --------
const url =
  "mongodb+srv://c109118108:c109118108shortUrl@cluster0.vcn901g.mongodb.net/";
// connect to mongo DB -----
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("success connect to mongoose. ");
  })
  .catch((e) => {
    console.log(e);
  });
// middleware ------------
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// route --------------
app.post("/shortUrl", async (req, res) => {
  if (req.body.fullUrl && req.body.fullUrl.startsWith("http")) {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect("/");
  } else {
    await ShortUrl.create({ full: "null" });
    res.redirect("/");
  }
});

app.get("/closeWindow", async (req, res) => {
  await ShortUrl.deleteMany({});
  console.log("Database cleared successfully.");
});

app.get("/", async (req, res) => {
  const db = await ShortUrl.find();
  const shortUrl = await ShortUrl.find({ full: { $ne: "null" } })
    .sort({ _id: -1 })
    .limit(1);
  if (shortUrl === undefined) res.render("index", { shortUrl: undefined });
  else if (db.length !== 0 && (shortUrl.length === 0 || !shortUrl))
    res.render("index", { shortUrl: "error", errMsg: "Invalid Url. " });
  else res.render("index", { shortUrl: shortUrl[0] });
});
// server -------------
app.listen(process.env.PORT || 5000, () =>
  console.log("server listening in port 5000")
);
