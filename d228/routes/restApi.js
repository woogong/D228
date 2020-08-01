var express = require('express');
var router = express.Router();
var memberService = require("../modules/memberService");

router.get('/member/list.do', function (req, res, next) {
  memberService.execute("getMemberList", null, function (result) {
    res.json(result);
  });
});

router.get('/member/list_simple.do', function (req, res, next) {
  memberService.execute("getSimpleMemberList", null, function (result) {
    res.json(result);
  });
});

router.post('/member/read.do', function (req, res, next) {
  memberService.execute("getMember", req.body, function (result) {
    res.json(result);
  });
});

router.post('/member/register.do', function (req, res, next) {
  memberService.execute("registerMember", req.body, function (result) {
    res.json({'resultCode': "Success"});
  });
});

router.get('/member/new_id.do', function (req, res, next) {
  memberService.execute("getNewMemberId", null, function (result) {
    var newId = ((result.max_id - 0) + 1) + "";

    res.send(newId);
  });
});

router.post('/member/member_id_unique.do', function (req, res, next) {
  memberService.execute("getCountOfMembers", req.body, function (result) {
    res.send((result.countMembers == 0) ? "true" : "false");
  });
});


module.exports = router;
