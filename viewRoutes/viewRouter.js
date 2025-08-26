const express = require("express");

const viewsRouter = express.Router();

viewsRouter.get("/", (req, res, next) => {
  res.status(200).render("base", {
    tour: "The Sea Surfer",
    user: "Jonas"
  });
});
viewsRouter.get("/overview", (req, res, next) => {
  res.status(200).render("overview", {
    title: "All Tours"
  });
});
viewsRouter.get("/tour", (req, res, next) => {
  res.status(200).render("tour", {
    title: "The Forest Hiker"
  });
});

module.exports = viewsRouter;
