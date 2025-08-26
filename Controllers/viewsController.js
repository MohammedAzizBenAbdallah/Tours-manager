exports.getOverview = (req, res, next) => {
  res.status(200).render("overview", {
    title: "All Tours"
  });
};
