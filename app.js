const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const path = require("path");
const Collab = require("./models/unicollab"); //importing the DB Schema

//Connecting to our DataBase
mongoose.connect("mongodb://localhost:27017/uni-collab");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.on("open", () => {
  console.log("Database Connected");
});

const app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));

//parsing the URL Body
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.render("Home");
});

app.get("/aboutus", (req, res) => {
  res.render("aboutus");
});

app.get("/collab", async (req, res) => {
  const collabs = await Collab.find({});
  console.log(collabs);
  if (collabs.length === 0) {
    res.render("noCollabs");
  } else {
    res.render("collab", { collabs });
  }
});

app.get("/collab/new", (req, res) => {
  res.render("new");
});

app.get("/collab/:id", async (req, res) => {
  console.log(req.params);
  const collab = await Collab.findById(req.params.id);
  res.render("show", { collab });
});

app.post("/collab", async (req, res) => {
  const collab = new Collab(req.body.collab);
  await collab.save();
  res.redirect(`/collab/${collab._id}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
