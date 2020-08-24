const xlsx = require("xlsx");
const fs = require("fs");

var json = [
    {name: '홍길동', birthday: '1975-12-12', height: 178},
    {name: '임꺽정', birthday: '1981-04-20', height: 190},
    {name: '장길산', birthday: '1968-07-17', height: 174},
    {name: '박문수', birthday: '1980-02-28', height: 168},
    {name: '김삿갓', birthday: '1977-09-09', height: 170}
];

//console.log(json);

var workbook = xlsx.utils.book_new();
var sheet = xlsx.utils.json_to_sheet(json);

sheet.A1.v = "이름";
sheet.B1.v = "생일";
sheet.C1.v = "키";

var cols = [
    {wch: 20, hidden: true},
    {wch: 15},
    {wch: 10},
];

sheet['!cols'] = cols;

xlsx.utils.book_append_sheet(workbook, sheet, "sheet_name");

var range = xlsx.utils.decode_range(sheet['!ref']);
var countRows = range.e.r + 1;

for (var i = 2 ; i <= countRows ; i++)
{
    var address = xlsx.utils.encode_row(i);
    //console.log(sheet['C' + i]);
    sheet['C' + i].v = sheet['C' + i].v + "cm";
    sheet['C' + i].t = 's';
}


xlsx.writeFile(workbook, "a.xlsx");
