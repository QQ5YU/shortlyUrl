const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express();
// declare variable --------
const url = `mongodb+srv://peiyu:Qq23201729@cluster0.qwmdugw.mongodb.net/?retryWrites=true&w=majority`;
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
  if (req.body.fullUrl) {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect("/");
  } else {
    res.render("index", { shortUrl: null, errMsg: "Url cannot be empty. " });
  }
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl === null) return res.status(404);
  else res.redirect(shortUrl.full);
});

app.get("/", async (req, res) => {
  const shortUrl = await ShortUrl.find().sort({ _id: -1 }).limit(1);
  res.render("index", { shortUrl: shortUrl[0] });
});
// server -------------
app.listen(process.env.PORT || 5000);
