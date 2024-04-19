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

app.get("/collab/:id", async (req, res) => {
  const { id } = req.params;
  const collab = await Collab.findById(id);
  res.render("show", { collab });
});

app.get("/collab/:id/edit", async (req, res) => {
  const { id } = req.params;
  const collab = await Collab.findById(id);
  res.render("edit", { collab });
});

app.put("/collab/:id", async (req, res) => {
  const { id } = req.params;
  const collab = await Collab.findByIdAndUpdate(id, {
    ...req.body.collab,
  });
  res.redirect(`/collab/${collab._id}`);
});

app.delete("/collab/:id", async (req, res) => {
  const { id } = req.params;
  await Collab.findByIdAndDelete(id);
  res.redirect("/collab");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});