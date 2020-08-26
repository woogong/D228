var database = require("./database");

var api = {

	execute: function(job, params, callback, callbackFail) {
		try
		{
			var query = eval("this." + job)(params);
			console.log(query);
			database.executeQuery(query, callback, callbackFail);
		}
		catch (exception)
		{
			console.log(exception);
			callbackFail(exception);
		}
	},

	getMemberList: function(params, callback) {
		var sql = "";
		sql += "SELECT a.*, b.fee_year  ";
		sql += "  FROM membership AS a ";
		sql += "  LEFT JOIN (  ";
		sql += "    	SELECT member_seq, MAX(year) AS fee_year  ";
		sql += "	      FROM membership_fee  ";
		sql += "    	 GROUP BY member_seq  ";
		sql += "      ) AS b ON a.member_seq = b.member_seq  ";

		if (params)
		{
			console.log("params", params);

			sql += " WHERE a.member_seq > 0 ";

			if (params.query && params.query.length > 0)
			{
				sql += "  AND (member_id LIKE '%" + params.query + "%' ";
				sql += "       OR name LIKE '%" + params.query + "%' ";
				sql += "       OR job LIKE '%" + params.query + "%') ";
				sql += "       ";
				sql += "       ";
				sql += "       ";
				sql += "       ";
			}

			if (params.feeFilter)
			{
				var thisYear = new Date().getFullYear();

				if (params.feeFilter == 'Y')
				{
					sql += "  AND fee_year = " + thisYear + " ";
				}
				else if (params.feeFilter == 'N')
				{
					sql += "  AND (fee_year != " + thisYear + " OR fee_year IS NULL) ";

				}
			}
		}

		sql += " ORDER BY a.member_seq  ";

		return sql;
	},

	getSimpleMemberList: function(params, callback) {
		var sql = "";
		sql += "SELECT ";
		sql += "	a.member_seq, "; 
		sql += "	a.member_id, "; 
		sql += "	a.name, "; 
		sql += "	a.phone_mobile, "; 
		sql += "	a.phone_home, "; 
		sql += "	a.birthday, "; 
		sql += "	a.zipcode, "; 
		sql += "	a.address, "; 
		sql += "	a.email "; 
		sql += "  FROM membership AS a ";
		sql += " ORDER BY a.name  ";

		return sql;
	},

	getMember: function(params, callback) {
		var sql = "";
		sql += "SELECT a.*, b.name AS introducer_name, b.member_id AS introducer_id  ";
		sql += "  FROM membership AS a ";
		sql += "  LEFT JOIN membership AS b on a.introducer_seq = b.member_seq";
		sql += " WHERE a.member_seq = " + params.memberSeq + " ";

		return sql;
	},

	registerMember: function(params, callback) {
		var sql = "";
		sql += "INSERT INTO membership  ";
		sql += "  (member_id, ";
		sql += "   name, ";
		sql += "   birthday, ";
		sql += "   register_date, ";
		sql += "   zipcode, ";
		sql += "   address, ";
		sql += "   phone_home, ";
		sql += "   phone_mobile, ";
		sql += "   email, ";
		sql += "   job, ";
		sql += "   introducer_seq, ";
		sql += "   note, ";
		sql += "   gender, ";
		sql += "   school, ";
		sql += "   grade, ";
		sql += "   class1, ";
		sql += "   member_type) ";
		sql += "VALUES  ";
		sql += "  ('" + (params.memberId ? params.memberId : "") + "', ";
		sql += "   '" + (params.name ? params.name : "") + "', ";
		sql += "    " + (params.birthday != "" ? "'" + params.birthday + "'" : "null") + ", ";
		sql += "   '" + (params.registerDate ? params.registerDate : "") + "', ";
		sql += "   '" + (params.zipcode ? params.zipcode : "") + "', ";
		sql += "   '" + (params.address ? params.address : "") + "', ";
		sql += "   '" + (params.phoneHome ? params.phoneHome : "") + "', ";
		sql += "   '" + (params.phoneMobile ? params.phoneMobile : "") + "', ";
		sql += "   '" + (params.email ? params.email : "") + "', ";
		sql += "   '" + (params.job ? params.job : "") + "', ";
		sql += "    " + ((params.introducer && params.introducer != 0) ? "'" + params.introducer + "'" : "null") + ", ";
		sql += "   '" + (params.note ? params.note : "") + "', ";
		sql += "   '" + (params.gender ? params.gender : "") + "', ";
		sql += "   '" + (params.school ? params.school : "") + "', ";
		sql += "   '" + (params.grade ? params.grade : "") + "', ";
		sql += "   '" + (params.class1 ? params.class1 : "") + "', ";
		sql += "   '" + (params.memberType ? params.memberType : "C") + "') ";

		return sql;
	},

	registerMemberBatch: function(params, callback) {
		var member_type = "";
		if (params.member_type)
		{
			if (params.member_type == "P")
			{
				member_type = "후원회원";
			}
			else if (params.member_type == "F")
			{
				member_type = "가족회원";
			}
			else if (params.member_type == "S")
			{
				member_type = "학생회원";
			}
			else
			{
				member_type = "일반회원";
			}
		}

		var sql = "";
		sql += "INSERT INTO membership  ";
		sql += "  (member_id, ";
		sql += "   name, ";
		sql += "   birthday, ";
		sql += "   register_date, ";
		sql += "   zipcode, ";
		sql += "   address, ";
		sql += "   phone_home, ";
		sql += "   phone_mobile, ";
		sql += "   email, ";
		sql += "   job, ";
		sql += "   introducer_seq, ";
		sql += "   note, ";
		sql += "   gender, ";
		sql += "   school, ";
		sql += "   grade, ";
		sql += "   class1, ";
		sql += "   member_type) ";
		sql += "VALUES  ";
		sql += "  ('" + (params.member_id ? params.member_id : "") + "', ";
		sql += "   '" + (params.name ? params.name : "") + "', ";
		sql += "    " + (params.birthday != "" ? "'" + params.birthday + "'" : "null") + ", ";
		sql += "   '" + (params.register_date ? params.register_date : "") + "', ";
		sql += "   '" + (params.zipcode ? params.zipcode : "") + "', ";
		sql += "   '" + (params.address ? params.address : "") + "', ";
		sql += "   '" + (params.phone_home ? params.phone_home : "") + "', ";
		sql += "   '" + (params.phone_mobile ? params.phone_mobile : "") + "', ";
		sql += "   '" + (params.email ? params.email : "") + "', ";
		sql += "   '" + (params.job ? params.job : "") + "', ";
		sql += "    " + ((params.introducer_seq && params.introducer_seq != 0) ? "'" + params.introducer_seq + "'" : "null") + ", ";
		sql += "   '" + (params.note ? params.note : "") + "', ";
		sql += "   '" + (params.gender ? (params.gender == "남" ? "M" : "F") : "") + "', ";
		sql += "   '" + (params.school ? params.school : "") + "', ";
		sql += "   '" + (params.grade ? params.grade : "") + "', ";
		sql += "   '" + (params.class1 ? params.class1 : "") + "', ";
		sql += "   '" + member_type + "') ";

		return sql;
	},

	updateMember: function(params, callback)
	{
		var sql = "";
		sql += "UPDATE membership SET ";
		sql += "	member_id = '" + params.memberId + "', ";
		sql += "	name = '" + params.name + "', ";
		sql += "	birthday = '" + params.birthday + "', ";
		sql += "	register_date = '" + params.registerDate + "', ";
		sql += "	zipcode = '" + params.zipcode + "', ";
		sql += "	address = '" + params.address + "', ";
		sql += "	phone_home = '" + params.phoneHome + "', ";
		sql += "	phone_mobile = '" + params.phoneMobile + "', ";
		sql += "	email = '" + params.email + "', ";
		sql += "	job = '" + params.job + "', ";
		sql += "	introducer_seq = '" + params.introducer + "', ";
		sql += "	note = '" + params.note + "', ";
		sql += "	gender = '" + params.gender + "', ";
		sql += "	school = '" + params.school + "', ";
		sql += "	grade = '" + params.grade + "', ";
		sql += "	class1 = '" + params.class1 + "', ";
		sql += "	member_type = '" + params.memberType + "' ";
		sql += " WHERE member_seq = " + params.memberSeq + " ";

		return sql;
	},

	removeMember: function(params, callback)
	{
		var sql = "";
		sql += "DELETE FROM membership ";
		sql += " WHERE member_seq = " + params.memberSeq + " ";

		return sql;
	},

	getNewMemberId: function(params, callback) {
		var sql = "";
		sql += "SELECT MAX(member_id) AS max_id ";
		sql += "  FROM membership ";

		return sql;
	},

	getCountOfMembers: function(params, callback) {
		var sql = "";
		sql += "SELECT COUNT(*) AS countMembers  ";
		sql += "  FROM membership AS a ";
		sql += " where a.member_id = '" + params.value + "' ";

		return sql;
	},

	getMembershipFeeList: function(params, callback) {
		var sql = "";
		sql += "SELECT ";
		sql += "	a.fee_seq, ";
		sql += "	a.member_seq, ";
		sql += "	a.pay_date, ";
		sql += "	a.amount, ";
		sql += "	a.year, ";
		sql += "	a.type, ";
		sql += "	a.note, ";
		sql += "	b.name AS member_name, ";
		sql += "	b.member_seq, ";
		sql += "	b.member_id, ";
		sql += "	b.member_type ";
		sql += "  FROM membership_fee AS a ";
		sql += "  JOIN membership AS b ON a.member_seq = b.member_seq ";
		sql += " WHERE a.fee_seq > 0 "

		if (params.memberSeq && params.memberSeq > 0)
		{
			sql += "   AND a.member_seq = " + params.memberSeq + " ";
		}

		if (params.query)
		{
			sql += "   AND (b.member_id LIKE '%" + params.query + "%' ";
			sql += "        OR b.name LIKE '%" + params.query + "%' ";
			sql += "        OR a.year LIKE '%" + params.query + "%' ";
			sql += "        OR a.pay_date LIKE '%" + params.query + "%' ";
			sql += "        OR a.note LIKE '%" + params.query + "%') ";
		}

		sql += " ORDER BY a.fee_seq DESC ";

		return sql;
	},

	registerMembershipFee: function(params, callback) {
		var sql = "";
		sql += "INSERT INTO membership_fee  ";
		sql += "  (member_seq, ";
		sql += "   pay_date, ";
		sql += "   amount, ";
		sql += "   year, ";
		sql += "   type, ";
		sql += "   note) ";
		sql += "VALUES  ";
		sql += "  ('" + params.memberSeq + "', ";
		sql += "   '" + params.feeDate + "', ";
		sql += "   '" + params.amount + "', ";
		sql += "   '" + params.year + "', ";
		sql += "   '" + params.type + "', ";
		sql += "   '" + params.note + "') ";

		return sql;
	},

	registerMembershipFeeByMemberId: function(params, callback) {
		var sql = "";
		sql += "INSERT INTO membership_fee  ";
		sql += "  (member_seq, ";
		sql += "   pay_date, ";
		sql += "   amount, ";
		sql += "   year, ";
		sql += "   type, ";
		sql += "   note) ";
		sql += "VALUES  ";
		sql += "  ((SELECT member_seq FROM membership WHERE member_id = '" + params.member_id + "'), ";
		sql += "   '" + params.pay_date + "', ";
		sql += "   '" + params.amount + "', ";
		sql += "   '" + params.year + "', ";
		sql += "   '" + (params.type ? params.type : "") + "', ";
		sql += "   '" + (params.note ? params.note : "") + "') ";

		return sql;
	},

	updateMembershipFee: function(params, callback) {
		var sql = "";
		sql += "UPDATE membership_fee SET ";
		sql += "	pay_date = '" + params.feeDate + "', ";
		sql += "	amount = " + params.amount + ", ";
		sql += "	year = " + params.year + ", ";
		sql += "	type = '" + params.type + "', ";
		sql += "	note = '" + params.note + "' ";
		sql += " WHERE fee_seq = " + params.feeSeq + " ";

		return sql;
	},

	deleteMembershipFee: function(params, callback) {
		var sql = "";
		sql += "DELETE FROM membership_fee ";
		sql += " WHERE fee_seq = " + params.feeSeq + " ";

		return sql;
	},

	getMeritList: function(params, callback) {
		var sql = "";
		sql += "SELECT ";
		sql += "	a.merit_seq, ";
		sql += "	a.merit_id, ";
		sql += "	a.member_seq, ";
		sql += "	a.name, ";
		sql += "	a.birthday, ";
		sql += "	a.school, ";
		sql += "	a.graduate, ";
		sql += "	a.register_date, ";
		sql += "	a.phone_home, ";
		sql += "	a.phone_mobile, ";
		sql += "	a.zipcode, ";
		sql += "	a.address, ";
		sql += "	a.email, ";
		sql += "	a.note, ";
		sql += "	b.member_id ";
		sql += "  FROM merit AS a ";
		sql += "  LEFT JOIN membership AS b ON a.member_seq = b.member_seq ";

		if (params)
		{
			sql += " WHERE merit_id > 0 ";
			if (params.query)
			{
				sql += "   AND (a.merit_id LIKE '%" + params.query + "%' ";
				sql += "        OR a.name LIKE '%" + params.query + "%' ";
				sql += "        OR a.birthday LIKE '%" + params.query + "%' ";
				sql += "        OR a.school LIKE '%" + params.query + "%' ";
				sql += "        OR a.graduate LIKE '%" + params.query + "%' ";
				sql += "        OR a.phone_home LIKE '%" + params.query + "%' ";
				sql += "        OR a.phone_mobile LIKE '%" + params.query + "%' ";
				sql += "        OR a.note LIKE '%" + params.query + "%' ";
				sql += "        OR b.member_id LIKE '%" + params.query + "%') ";
			}
		}

		sql += " ORDER BY a.merit_seq  ";

		return sql;
	},

	getMerit: function(params, callback) {
		var sql = "";
		sql += "SELECT ";
		sql += "	a.merit_seq, ";
		sql += "	a.merit_id, ";
		sql += "	a.member_seq, ";
		sql += "	a.name, ";
		sql += "	a.birthday, ";
		sql += "	a.school, ";
		sql += "	a.graduate, ";
		sql += "	a.register_date, ";
		sql += "	a.phone_home, ";
		sql += "	a.phone_mobile, ";
		sql += "	a.zipcode, ";
		sql += "	a.address, ";
		sql += "	a.email, ";
		sql += "	a.note, ";
		sql += "	b.member_id ";
		sql += "  FROM merit AS a ";
		sql += "  LEFT JOIN membership AS b ON a.member_seq = b.member_seq ";
		sql += " WHERE merit_seq = " + params.meritSeq + " ";

		return sql;
	},

	registerMerit: function(params, callback) {
		var sql = "";
		sql += "INSERT INTO merit  ";
		sql += "  (merit_id, ";
		sql += "   member_seq, ";
		sql += "   name, ";
		sql += "   birthday, ";
		sql += "   school, ";
		sql += "   graduate, ";
		sql += "   zipcode, ";
		sql += "   address, ";
		sql += "   phone_home, ";
		sql += "   phone_mobile, ";
		sql += "   email, ";
		sql += "   note, ";
		sql += "   register_date) ";
		sql += "VALUES  ";
		sql += "  ('" + params.meritId + "', ";
		sql += "   " + ((params.memberSeq != 0) ? params.memberSeq : null) + ", ";
		sql += "   '" + params.name + "', ";
		sql += "   " + (params.birthday != "" ? "'" + params.birthday + "'" : "null") + ", ";
		sql += "   '" + params.school + "', ";
		sql += "   '" + params.graduate + "', ";
		sql += "   '" + params.zipcode + "', ";
		sql += "   '" + params.address + "', ";
		sql += "   '" + params.phoneHome + "', ";
		sql += "   '" + params.phoneMobile + "', ";
		sql += "   '" + params.email + "', ";
		sql += "   '" + params.note + "', ";
		sql += "   now()) ";

		return sql;
	},
	
	registerMeritByMemberId: function(params, callback) {
		var sql = "";
		sql += "INSERT INTO merit  ";
		sql += "  (merit_id, ";
		sql += "   member_seq, ";
		sql += "   name, ";
		sql += "   birthday, ";
		sql += "   school, ";
		sql += "   graduate, ";
		sql += "   zipcode, ";
		sql += "   address, ";
		sql += "   phone_home, ";
		sql += "   phone_mobile, ";
		sql += "   email, ";
		sql += "   note, ";
		sql += "   register_date) ";
		sql += "VALUES  ";
		sql += "  ('" + params.merit_id + "', ";
		sql += "    (SELECT member_seq FROM membership WHERE member_id = '" + params.member_id + "'), ";
		sql += "   '" + params.name + "', ";
		sql += "   " + (params.birthday != "" ? "'" + params.birthday + "'" : "null") + ", ";
		sql += "   '" + params.school + "', ";
		sql += "   '" + params.graduate + "', ";
		sql += "   '" + params.zipcode + "', ";
		sql += "   '" + params.address + "', ";
		sql += "   '" + params.phone_home + "', ";
		sql += "   '" + params.phone_mobile + "', ";
		sql += "   '" + params.email + "', ";
		sql += "   '" + params.note + "', ";
		sql += "   " + (params.register_date ? "'" + params.register_date + "'" : "now()") + ") ";

		return sql;
	},

	updateMerit: function(params, callback)
	{
		var sql = "";
		sql += "UPDATE merit SET ";
		sql += "	member_seq = '" + params.memberSeq + "', ";
		sql += "	merit_id = '" + params.meritId + "', ";
		sql += "	name = '" + params.name + "', ";
		sql += "	birthday = '" + params.birthday + "', ";
		sql += "	zipcode = '" + params.zipcode + "', ";
		sql += "	address = '" + params.address + "', ";
		sql += "	phone_home = '" + params.phoneHome + "', ";
		sql += "	phone_mobile = '" + params.phoneMobile + "', ";
		sql += "	email = '" + params.email + "', ";
		sql += "	note = '" + params.note + "', ";
		sql += "	school = '" + params.school + "', ";
		sql += "	graduate = '" + params.graduate + "' ";
		sql += " WHERE merit_seq = " + params.meritSeq + " ";

		return sql;
	},

	removeMerit: function(params, callback)
	{
		var sql = "";
		sql += "DELETE FROM merit ";
		sql += " WHERE merit_seq = " + params.meritSeq + " ";

		return sql;
	},

	getCountOfMerits: function(params, callback) {
		var sql = "";
		sql += "SELECT COUNT(*) AS countMerits  ";
		sql += "  FROM merit AS a ";
		sql += " where a.merit_id = '" + params.value + "' ";

		return sql;
	},

	getNewMeritId: function(params, callback) {
		var sql = "";
		sql += "SELECT MAX(merit_id) AS max_id ";
		sql += "  FROM merit ";

		return sql;
	},


	formatDate: function(value)
	{
		var date = new Date(value);
		if (!isNaN(date.getTime()))
		{
			return date.format("yyyy-MM-dd");
		}
	},

	dummy: null
};


module.exports = api;