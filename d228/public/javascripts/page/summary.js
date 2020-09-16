
$(document).ready(() => {
    summaryManager.init();
});

var summaryManager = {

    init: function()
    {
        this.thisYear = new Date().getFullYear();

        this.showMemberData();
        this.showMeritData();
    },

    showMemberData: function() {
        this.readMemberList((list) => {
            summaryManager.memberList = list;
            console.log(list);

            summaryManager.analizeMemberList();
            summaryManager.fillInMemberData();
        });
    },

    showMeritData: function() {
        this.readMeritList((list) => {
            summaryManager.meritList = list;
            console.log(list);

            summaryManager.analizeMeritList();
            summaryManager.fillInMeritData();
        });
    },

    fillInMemberData: function()
    {
        $("#count_member").html(formatNumber(this.countMembers) + "명");
        $("#count_regular").html(formatNumber(this.countRegulars) + "명");
        $("#count_fee").html(formatNumber(this.countFees) + "명");
    },

    fillInMeritData: function()
    {
        $("#count_merit").html(formatNumber(this.countMerits) + "명");
        $("#count_merit_member").html(formatNumber(this.countMeritMembers) + "명");
    },

    readMemberList: function(callback) {
        $.get("/rest/member/list.do", null, function(response) {
            callback(response);
        });
    },

    readMeritList: function(callback) {
        $.get("/rest/merit/list.do", null, function(response) {
            callback(response);
        });
    },

    analizeMemberList: function()
    {
        this.countMembers = this.memberList.length;
        this.countRegulars = 0;
        this.countFees = 0;

        for (var i in this.memberList)
        {
            if (this.memberList[i].regular_yn == "Y")
            {
                this.countRegulars++;
            }

            if (this.memberList[i].fee_year == this.thisYear)
            {
                this.countFees++;
            }
        }

        this.analizeMemberDataByRegisterDate();
        console.log(this.memberDataByRegisterDate);
        this.makeMemberRegisterDateDataTable();

        this.analizeMemberDataByBirthday();
        console.log(this.memberDataByBirthday);
        this.makeMemberBirthdayDataTable();
    },

    makeMemberRegisterDateDataTable: function()
    {
        var table = $("#table_register_date_data");
        var tbody = table.find("tbody");

        tbody.empty();

        for (var i in this.memberDataByRegisterDate)
        {
            var tr = $("<tr />");
            var td;

            td = $("<td />");
            td.html(i + "년");
            tr.append(td);

            var total = 0;
            for (var j = 0 ; j < 12 ; j++)
            {
                total += this.memberDataByRegisterDate[i][j];
                td = $("<td />");
                td.html(this.memberDataByRegisterDate[i][j]);
                tr.append(td);
            }

            td = $("<td />");
            td.html(total);
            tr.append(td);

            tbody.append(tr);
        }
    },

    makeMemberBirthdayDataTable: function()
    {
        var table = $("#table_birthday_data");
        var tbody = table.find("tbody");

        tbody.empty();

        for (var i in this.memberDataByBirthday)
        {
            var tr = $("<tr />");
            var td;

            td = $("<td />");
            td.html(i + "년");
            tr.append(td);

            td = $("<td />");
            td.html(this.memberDataByBirthday[i]);
            tr.append(td);

            tbody.append(tr);
        }
    },

    analizeMeritList: function()
    {
        this.countMerits = this.meritList.length;
        this.countMeritMembers = 0;

        for (var i in this.meritList)
        {
            if (this.meritList[i].member_seq)
            {
                this.countMeritMembers++;
            }
        }
    },

    analizeMemberDataByRegisterDate: function()
    {
        this.memberDataByRegisterDate = {};

        for (var i in this.memberList)
        {
            var registerDate = new Date(this.memberList[i].register_date);
            var year = registerDate.getFullYear();
            var month = registerDate.getMonth();

            if (!isNaN(year) && !isNaN(month))
            {
                var yearMap = this.memberDataByRegisterDate[year + ""];
                if (!yearMap)
                {
                    yearMap = {
                        0: 0,
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        6: 0,
                        7: 0,
                        8: 0,
                        9: 0,
                        10: 0,
                        11: 0
                    };
                    this.memberDataByRegisterDate[year + ""] = yearMap;
                }

                yearMap[month]++;
            }
        }
    },

    analizeMemberDataByBirthday: function()
    {
        this.memberDataByBirthday = {};

        for (var i in this.memberList)
        {
            var birthday = new Date(this.memberList[i].birthday);
            var year = birthday.getFullYear();

            if (!isNaN(year))
            {
                var count = this.memberDataByBirthday[year + ""];
                if (!count)
                {
                    count = 0;
                    this.memberDataByBirthday[year + ""] = count;
                }

                this.memberDataByBirthday[year + ""]++;
            }
        }
    },
};