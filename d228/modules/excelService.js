var xlsx = require("xlsx");
var dateformat = require("dateformat");
const { head } = require("../routes/restApi");

const TEMP_DIRECTORY = "/temp/";
const MEMBERSHIP_EXCEL_FILE = "_membership.xlsx";

function formatDate(value)
{
	var date = new Date(value);

	if ((date == "Invalid Date"))
	{
		return "";
	}
	else
	{
		return dateformat(date, "yyyy-mm-dd");	
	}
}

function formatMembershipType(value)
{
	var result;
	if ("S" == value)
	{
		result = "학생회원";
	}
	else if ("P" == value)
	{
		result = "후원회원";
	}
	else if ("F" == value)
	{
		result = "가족회원";
	}
	else
	{
		result = "일반회원";
	}

	return result;
}

const MEMBERSHIP_HEADER = {
	'member_seq': {enable: true, name: '관리번호', width: 7},
	'member_id': {enable: true, name: '회원아이디', width: 10},
	'seq': {enable: false},
	'name': {enable: true, name: '성명', width: 7},
	'birthday': {enable: true, name: '생년월일', width: 15, fnFormat: formatDate},
	'register_date': {enable: true, name: '가입일', width: 15, fnFormat: formatDate},
	'member_type': {enable: true, name: '회원종류', width: 10, fnFormat: formatMembershipType},
	'zipcode': {enable: true, name: '우편번호', width: 10},
	'address': {enable: true, name: '주소', width: 60},
	'phone_home': {enable: true, name: '전화번호', width: 15},
	'phone_mobile': {enable: true, name: '핸드폰', width: 15},
	'job': {enable: true, name: '직업(소속)', width: 30},
	'fee_year': {enable: true, name: '회비납부', width: 10},
	'introducer_seq': {enable: true, name: '추천인관리번호', width: 10},
	'email': {enable: true, name: '이메일', width: 20},
	'note': {enable: true, name: '비고', width: 50},
	'gender': {enable: true, name: '성별', width: 5},
	'school': {enable: true, name: '학교', width: 20},
	'grade': {enable: true, name: '학년', width: 5},
	'class1': {enable: true, name: '반', width: 5},
};

var api = {

	makeMembershipFile : function(data)
	{
		data = this._removeUnusedColumns(data, MEMBERSHIP_HEADER);

		var workbook = xlsx.utils.book_new();
		var sheet = xlsx.utils.json_to_sheet(data, {header: this._reorderColumns(MEMBERSHIP_HEADER)});
	
		this._renameHeader(sheet, MEMBERSHIP_HEADER);
		sheet['!cols'] = this._makeColumnWidthArray(MEMBERSHIP_HEADER);

		xlsx.utils.book_append_sheet(workbook, sheet, "회원목록");
	
		xlsx.writeFile(workbook, TEMP_DIRECTORY + MEMBERSHIP_EXCEL_FILE);

		return TEMP_DIRECTORY + MEMBERSHIP_EXCEL_FILE;
	},

	_removeUnusedColumns: function(data, headerOptions)
	{
		for (var i in data)
		{
			var line = data[i];

			for (column in line)
			{
				var option = headerOptions[column];
				if (option)
				{
					if (!option.enable)
					{
						delete line[column];
					}
					else if (option.fnFormat)
					{
						line[column] = option.fnFormat(line[column]);
					}
				}
			}
		}

		return data;
	},

	_renameHeader: function(sheet, headerOptions)
	{
		var range = xlsx.utils.decode_range(sheet['!ref']);

		var countColumns = range.e.c;
		for (var i = 0 ; i <= countColumns ; i++)
		{
			var addr = xlsx.utils.encode_col(i);

			var cell = sheet[addr + '1'];
			var columnName = cell.v;
			var option = headerOptions[columnName];

			if (option)
			{
				if (option.name)
				{
					cell.v = option.name;
				}
			}
		}
	},

	_makeColumnWidthArray : function(headerOptions) {
		var result = [];

		for (var i in headerOptions)
		{
			if (headerOptions[i].enable)
			{
				var width = 5;

				if (headerOptions[i].width)
				{
					width = headerOptions[i].width;
				}

				result.push({wch: width});				
			}
		}

		return result;
	},

	_reorderColumns: function(headerOptions)
	{
		var result = [];

		for (var i in headerOptions)
		{
			if (headerOptions[i].enable)
			{
				result.push(i);
			}
		}

		return result;
	},


	dummy: null
};


module.exports = api;