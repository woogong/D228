var express = require('express');
var router = express.Router();
var multer = require('multer');
var xlsx = require("xlsx");
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var memberService = require("../modules/memberService");
var excelService = require("../modules/excelService");


let upload = new multer({
	dest: "upload/"
});

function doBatchRegister(req, fnDataBuilder, saveJob)
{
	let file = req.file;

	var workbook = xlsx.readFile(file.path, {locale: "ko_KR", cellDates: true, dateNF: 'yyyy-mm-dd'});
	var worksheet;
	for (var i in workbook.Sheets)
	{
		worksheet = workbook.Sheets[i];
		break;
	}

	var json = xlsx.utils.sheet_to_json(worksheet, {defval: null, raw: false});

	for (var i in json)
	{
		var data = fnDataBuilder(json[i]);

		memberService.execute(saveJob, data);
	}

	let result = {
		resultCode: "Success"
	}

	return result;
};

router.get('/member/list.do', function (req, res, next) {
	memberService.execute("getMemberList", null, function (result) {
		res.json(result);
	});
});

router.get('/excel/membership_list.do', function (req, res, next) {
	memberService.execute("getMemberList", req.query, function (result) {
		
		var file = excelService.makeMembershipFile(result);

		var mimetype = mime.lookup(file);
	  
		res.setHeader("Content-disposition", "attachment; filename=" + encodeURIComponent("회원목록.xlsx"));
		res.setHeader('Content-type', mimetype);
	  
		var filestream = fs.createReadStream(file);
		filestream.pipe(res);
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

router.get('/excel/membership_fee_list.do', function (req, res, next) {
	memberService.execute("getMembershipFeeList", req.query, function (result) {
		
		var file = excelService.makeMembershipFeeFile(result);

		var mimetype = mime.lookup(file);
	  
		res.setHeader("Content-disposition", "attachment; filename=" + encodeURIComponent("회비납부목록.xlsx"));
		res.setHeader('Content-type', mimetype);
	  
		var filestream = fs.createReadStream(file);
		filestream.pipe(res);
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

router.get('/excel/merit_list.do', function (req, res, next) {
	memberService.execute("getMeritList", req.query, function (result) {
		var data;
		if (Array.isArray(result))
		{
			data = result;
		}
		else
		{
			data = [];
			data.push(result);
		}

		var file = excelService.makeMeritListFile(data);

		var mimetype = mime.lookup(file);
	  
		res.setHeader("Content-disposition", "attachment; filename=" + encodeURIComponent("유공자목록.xlsx"));
		res.setHeader('Content-type', mimetype);
	  
		var filestream = fs.createReadStream(file);
		filestream.pipe(res);
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

router.post('/file/membership_register.do', upload.single("excelFile"), function (req, res, next) {
	let file = req.file;

	var workbook = xlsx.readFile(file.path, {locale: "ko_KR", cellDates: true, dateNF: 'yyyy-mm-dd'});
	var worksheet;
	for (var i in workbook.Sheets)
	{
		worksheet = workbook.Sheets[i];
		break;
	}

	var json = xlsx.utils.sheet_to_json(worksheet, {defval: null, raw: false});

	for (var i in json)
	{
		memberService.execute("registerMember", json[i]);
	}

	let result = {
		resultCode: "Success"
	}

	res.json(result);
});

router.post('/file/membership_fee_register.do', upload.single("excelFile"), function (req, res, next) {
	let file = req.file;

	var workbook = xlsx.readFile(file.path, {locale: "ko_KR", cellDates: true, dateNF: 'yyyy-mm-dd'});
	var worksheet;
	for (var i in workbook.Sheets)
	{
		worksheet = workbook.Sheets[i];
		break;
	}

	var json = xlsx.utils.sheet_to_json(worksheet, {defval: null, raw: false});

	for (var i in json)
	{
		var data = excelService.buildMembershipFeeData(json[i]);
		memberService.execute("registerMembershipFeeByMemberId", data);
	}

	let result = {
		resultCode: "Success"
	}

	res.json(result);
});

router.post('/file/merit_register.do', upload.single("excelFile"), function (req, res, next) {
	var result = doBatchRegister(req, excelService.buildMeritData, "registerMeritByMemberId");
	res.json(result);
});


module.exports = router;
