const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Collab = require("../models/unicollab"); //importing the DB Schema
const collabSchema = require("../schemas");
const { isLoggedIn } = require("../middleware");

const validateCollab = (req, res, next) => {
  const { err } = collabSchema.validate(req.body);
  if (err) {
    const msg = err.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", (req, res) => {
  res.render("Home");
});

router.get("/aboutus", (req, res) => {
  res.render("aboutus");
});

router.get(
  "/collab",
  catchAsync(async (req, res) => {
    const collabs = await Collab.find({});
    console.log(collabs);
    if (collabs.length === 0) {
      res.render("noCollabs");
    } else {
      res.render("collab", { collabs });
    }
  })
);

router.get("/collab/new", isLoggedIn, (req, res) => {
  res.render("new");
});

router.get(
  "/collab/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const collab = await Collab.findById(id);
    res.render("show", { collab });
  })
);

router.post(
  "/collab",
  isLoggedIn,
  validateCollab,
  catchAsync(async (req, res, next) => {
    const collab = new Collab(req.body.collab);
    await collab.save();
    res.redirect(`/collab/${collab._id}`);
  })
);

router.get(
  "/collab/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const collab = await Collab.findById(id);
    res.render("edit", { collab });
  })
);

router.put(
  "/collab/:id",
  isLoggedIn,
  validateCollab,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const collab = await Collab.findByIdAndUpdate(id, {
      ...req.body.collab,
    });
    res.redirect(`/collab/${collab._id}`);
  })
);

router.delete(
  "/collab/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Collab.findByIdAndDelete(id);
    res.redirect("/collab");
  })
);

module.exports = router;
