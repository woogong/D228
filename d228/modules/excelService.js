var xlsx = require("xlsx");
var dateformat = require("dateformat");
const { head } = require("../routes/restApi");

const TEMP_DIRECTORY = "/temp/";
const MEMBERSHIP_EXCEL_FILE = "_membership.xlsx";
const MEMBERSHIP_FEE_EXCEL_FILE = "_membership_fee.xlsx";
const MERIT_EXCEL_FILE = "_merit.xlsx";

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

function formatRegularYn(value)
{
	var result;
	if ("Y" == value)
	{
		result = "정회원";
	}
	else
	{
		result = "준회원";
	}

	return result;
}

function formatGraduate(value)
{
	if (value == 0)
	{
		return "";
	}

	return value;
}

function formatGender(value)
{
	if (value == "M")
	{
		return "남";
	}
	else if (value == "F")
	{
		return "여";
	}

	return "";
}

const MEMBERSHIP_HEADER = {
	'member_seq': {enable: true, name: '관리번호', width: 7},
	'member_id': {enable: true, name: '회원아이디', width: 10},
	'seq': {enable: false},
	'name': {enable: true, name: '성명', width: 7},
	'birthday': {enable: true, name: '생년월일', width: 15, fnFormat: formatDate},
	'register_date': {enable: true, name: '가입일', width: 15, fnFormat: formatDate},
	'member_type': {enable: true, name: '회원종류', width: 10, fnFormat: formatMembershipType},
	'regular_yn': {enable: true, name: '정회원', width: 10, fnFormat: formatRegularYn},
	'zipcode': {enable: true, name: '우편번호', width: 10},
	'address': {enable: true, name: '주소', width: 60},
	'phone_home': {enable: true, name: '전화번호', width: 15},
	'phone_mobile': {enable: true, name: '핸드폰', width: 15},
	'job': {enable: true, name: '직업(소속)', width: 30},
	'fee_year': {enable: true, name: '회비납부', width: 10},
	'introducer_seq': {enable: true, name: '추천인관리번호', width: 10},
	'email': {enable: true, name: '이메일', width: 20},
	'note': {enable: true, name: '비고', width: 50},
	'gender': {enable: true, name: '성별', width: 5, fnFormat: formatGender},
	'school': {enable: true, name: '학교', width: 20},
	'grade': {enable: true, name: '학년', width: 5},
	'class1': {enable: true, name: '반', width: 5},
	'merit_seq': {enable: false},
	'merit_id': {enable: false},
};

const MEMBERSHIP_FEE_HEADER = {
	'member_id': {enable: true, name: '회원아이디', width: 10},
	'pay_date': {enable: true, name: '납부일', width: 15, fnFormat: formatDate},
	'member_name': {enable: true, name: '성명', width: 7},
	'amount': {enable: true, name: '납부금액', width: 10},
	'type': {enable: true, name: '납부방법', width: 10},
	'year': {enable: true, name: '년도', width: 7},
	'member_type': {enable: true, name: '회원종류', width: 10, fnFormat: formatMembershipType},
	'note': {enable: true, name: '비고', width: 50},
	'fee_seq': {enable: false},
	'member_seq': {enable: false},
};

const MERIT_HEADER = {
	'member_id': {enable: true, name: '회원아이디', width: 10},
	'merit_id': {enable: true, name: '연번', width: 7},
	'name': {enable: true, name: '성명', width: 7},
	'birthday': {enable: true, name: '생년월일', width: 15, fnFormat: formatDate},
	'school': {enable: true, name: '출신학교', width: 25},
	'graduate': {enable: true, name: '기수', width: 5, fnFormat: formatGraduate},
	'phone_home': {enable: true, name: '전화번호', width: 15},
	'phone_mobile': {enable: true, name: '핸드폰', width: 15},
	'email': {enable: true, name: '이메일', width: 20},
	'zipcode': {enable: true, name: '우편번호', width: 10},
	'address': {enable: true, name: '주소', width: 60},
	'register_date': {enable: true, name: '등록일', width: 15, fnFormat: formatDate},
	'note': {enable: true, name: '비고', width: 50},
	'merit_seq': {enable: false},
	'member_seq': {enable: false},
};

const MEMBERSHIP_FIELDS = {
	'회원아이디': 'member_id',
	'성명': 'name',
	'생년월일': 'birthday',
	'가입일': 'register_date',
	'회원종류': 'member_type',
	'정회원': 'regular_yn',
	'전화번호': 'phone_home',
	'핸드폰': 'phone_mobile',
	'우편번호': 'zipcode',
	'주소': 'address',
	'이메일': 'email',
	'직업(소속)': 'job',
	'추천인관리번호': 'introducer_seq',
	'비고': 'note',
	'성별': 'gender',
	'학교': 'school',
	'학년': 'grade',
	'반': 'class1',
};

const MEMBERSHIP_FEE_FIELDS = {
	'회원아이디': 'member_id',
	'성명': 'name',
	'년도': 'year',
	'납부금액': 'amount',
	'납부방법': 'type',
	'납부일': 'pay_date',
	'회원종류': 'member_type',
	'비고': 'note'
};

const MERIT_FIELDS = {
	'회원아이디': 'member_id',
	'연번': 'merit_id',
	'성명': 'name',
	'생년월일': 'birthday',
	'출신학교': 'school',
	'기수': 'graduate',
	'전화번호': 'phone_home',
	'핸드폰': 'phone_mobile',
	'우편번호': 'zipcode',
	'주소': 'address',
	'이메일': 'email',
	'등록일': 'register_date',
	'비고': 'note'
};

var api = {

	makeMembershipFile : function(data)
	{
		return this.makeExcelFile(data, MEMBERSHIP_HEADER, MEMBERSHIP_EXCEL_FILE, "회원목록");
	},

	makeMembershipFeeFile : function(data)
	{
		return this.makeExcelFile(data, MEMBERSHIP_FEE_HEADER, MEMBERSHIP_FEE_EXCEL_FILE, "회비납부목록");
	},

	makeMeritListFile : function(data)
	{
		return this.makeExcelFile(data, MERIT_HEADER, MERIT_EXCEL_FILE, "유공자목록");
	},

	buildMembershipData: function(raw)
	{
		return api.buildJsonData(raw, MEMBERSHIP_FIELDS);
	},

	buildMembershipFeeData: function(raw)
	{
		return api.buildJsonData(raw, MEMBERSHIP_FEE_FIELDS);
	},

	buildMeritData: function(raw)
	{
		return api.buildJsonData(raw, MERIT_FIELDS);
	},

	makeExcelFile : function(data, headerOptions, fileName, sheetName)
	{
		data = this._removeUnusedColumns(data, headerOptions);

		var workbook = xlsx.utils.book_new();
		var sheet = xlsx.utils.json_to_sheet(data, {header: this._reorderColumns(headerOptions)});
	
		this._renameHeader(sheet, headerOptions);
		sheet['!cols'] = this._makeColumnWidthArray(headerOptions);

		xlsx.utils.book_append_sheet(workbook, sheet, sheetName);
	
		xlsx.writeFile(workbook, TEMP_DIRECTORY + fileName);

		return TEMP_DIRECTORY + fileName;
	},

	buildJsonData: function(raw, convertTable)
	{
		var data = {};

		for (var i in raw)
		{
			data[convertTable[i]] = raw[i];
		}

		return data;
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