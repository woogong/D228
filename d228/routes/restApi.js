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
		memberService.execute("getMembershipFeeList", req.body, function (result1) {
			if (result1)
			{
				if (Array.isArray(result1))
				{
					result.membershipFeeList = result1;
				}
				else
				{
					result.membershipFeeList = [];
					result.membershipFeeList.push(result1);
				}
			}
			else
			{
				result.membershipFeeList = [];
			}

			res.json(result);
		});
	});
});

router.post('/member/register.do', function (req, res, next) {
	memberService.execute("registerMember", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.post('/member/update.do', function (req, res, next) {
	memberService.execute("updateMember", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.post('/member/remove.do', function (req, res, next) {
	memberService.execute("removeMember", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
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

router.post('/member/membership_fee_list.do', function (req, res, next) {
	memberService.execute("getMembershipFeeList", req.body, function (result) {
		res.json(result);
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.post('/member/membership_fee_register.do', function (req, res, next) {
	memberService.execute("registerMembershipFee", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.post('/member/membership_fee_update.do', function (req, res, next) {
	memberService.execute("updateMembershipFee", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.post('/member/membership_fee_delete.do', function (req, res, next) {
	memberService.execute("deleteMembershipFee", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.get('/merit/list.do', function (req, res, next) {
	memberService.execute("getMeritList", null, function (result) {
		if (Array.isArray(result))
		{
			res.json(result);
		}
		else
		{
			var array = [];
			if (result)
			{
				array.push(result);
			}

			res.json(array);
		}
	});
});

router.post('/merit/read.do', function (req, res, next) {
	memberService.execute("getMerit", req.body, function (result) {
		res.json(result);
	});
});

router.post('/merit/register.do', function (req, res, next) {
	memberService.execute("registerMerit", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.post('/merit/update.do', function (req, res, next) {
	memberService.execute("updateMerit", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.post('/merit/remove.do', function (req, res, next) {
	memberService.execute("removeMerit", req.body, function (result) {
		res.json({ 'resultCode': "Success" });
	}, function(err) {
		res.json({'resultCode': "Fail", 'failMessage': err});
	});
});

router.post('/merit/merit_id_unique.do', function (req, res, next) {
	memberService.execute("getCountOfMerits", req.body, function (result) {
		res.send((result.countMerits == 0) ? "true" : "false");
	});
});

router.get('/merit/new_id.do', function (req, res, next) {
	memberService.execute("getNewMeritId", null, function (result) {
		var newId = (((result.max_id - 0) + 1) + 10000) + "";

		res.send(newId.substring(1));
	});
});




module.exports = router;
