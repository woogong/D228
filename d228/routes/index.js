var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("member/list");
});

router.get("/login", function (req, res, next) {
  res.render("admin/login");
});

router.get("/member/list", function (req, res, next) {
  var session = req.session;
  console.log("[session]", session);

  res.render("member/list");
});

router.get("/member/register", function (req, res, next) {
  res.render("member/register");
});

router.get("/member/detail", function (req, res, next) {
  res.render("member/detail");
});

router.get("/member/update", function (req, res, next) {
  res.render("member/update");
});

router.get("/member/fee_list", function (req, res, next) {
  res.render("member/fee_list");
});

router.get("/merit/list", function (req, res, next) {
  res.render("merit/merit_list");
});

router.get("/merit/register", function (req, res, next) {
  res.render("merit/merit_register");
});

router.get("/merit/detail", function (req, res, next) {
  res.render("merit/merit_detail");
});

router.get("/merit/update", function (req, res, next) {
  res.render("merit/merit_update");
});

router.get("/admin/list", function (req, res, next) {
  res.render("admin/admin_list");
});

router.get("/admin/register", function (req, res, next) {
  res.render("admin/admin_register");
});

router.get("/admin/update", function (req, res, next) {
  res.render("admin/admin_update");
});


module.exports = router;
