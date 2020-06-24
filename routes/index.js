var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "228 기념사업회" });
});

router.get("/member/list", function (req, res, next) {
  res.render("member/list");
});

router.get("/register", function (req, res, next) {
  res.render("register/index");
});

module.exports = router;
