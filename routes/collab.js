const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Collab = require("../models/unicollab"); //importing the DB Schema
const collabSchema = require("../schemas");
const { isLoggedIn, isAuthor } = require("../middleware");

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
  "/collab/mycollabs",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = req.user;
    console.log(user);
    const collabs = await Collab.find({ author: req.user._id });
    console.log(collabs);
    res.render("collab", { collabs });
  })
);

router.get(
  "/collab/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const collab = await Collab.findById(id).populate("author");
    if (!collab) {
      req.flash("error", "Cannot find the Collab!");
      return res.redirect("/collab");
    }
    res.render("show", { collab });
  })
);

router.post(
  "/collab",
  isLoggedIn,
  validateCollab,
  catchAsync(async (req, res, next) => {
    const collab = new Collab(req.body.collab);
    collab.author = req.user._id;
    await collab.save();
    req.flash("success", "Successfully Created a new Collab");
    res.redirect(`/collab/${collab._id}`);
  })
);

router.get(
  "/collab/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const collab = await Collab.findById(id);
    if (!collab) {
      req.flash("error", "Cannot find the campground");
      return res.redirect("/collab");
    }
    res.render("edit", { collab });
  })
);

router.put(
  "/collab/:id",
  isLoggedIn,
  isAuthor,
  validateCollab,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const collab = await Collab.findByIdAndUpdate(id, {
      ...req.body.collab,
    });
    req.flash("success", "Successfully Updated Collab");
    res.redirect(`/collab/${collab._id}`);
  })
);

router.delete(
  "/collab/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const collab = await Collab.findById(id);
    if (!collab.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/collab/${id}`);
    }
    await Collab.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Collab");
    res.redirect("/collab");
  })
);

module.exports = router;
