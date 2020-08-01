var database = require("./database");

var api = {

	execute: function(job, params, callback) {
		var query = eval("this." + job)(params);
		database.executeQuery(query, callback);
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
		sql += " ORDER BY a.member_seq  ";

		return sql;
	},

	getSimpleMemberList: function(params, callback) {
		var sql = "";
		sql += "SELECT a.member_seq, a.member_id, a.name, a.phone_mobile  ";
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
		sql += "   seq, ";
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
		sql += "  ('" + params.memberId + "', ";
		sql += "   " + '0' + ", ";
		sql += "   '" + params.name + "', ";
		sql += "   " + (params.birthday != "" ? "'" + params.birthday + "'" : "null") + ", ";
		sql += "   '" + params.registerDate + "', ";
		sql += "   '" + params.zipcode + "', ";
		sql += "   '" + params.address + "', ";
		sql += "   '" + params.phoneHome + "', ";
		sql += "   '" + params.phoneMobile + "', ";
		sql += "   '" + params.email + "', ";
		sql += "   '" + params.job + "', ";
		sql += "   " + (params.introducer != 0 ? "'" + params.introducer + "'" : "null") + ", ";
		sql += "   '" + params.note + "', ";
		sql += "   '" + (params.gender ? params.gender : "") + "', ";
		sql += "   '" + (params.school ? params.school : "") + "', ";
		sql += "   '" + (params.grade ? params.grade : "") + "', ";
		sql += "   '" + (params.class1 ? params.class1 : "") + "', ";
		sql += "   '" + params.memberType + "') ";

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


	dummy: null
};


module.exports = api;