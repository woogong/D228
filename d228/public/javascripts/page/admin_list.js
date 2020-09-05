
$(document).ready(function() {
    adminListManager.setEventHandlers();
    adminListManager.readList(adminListManager.showList);

    adminListManager.prepareInputValidation();
});

var adminListManager = {

    setEventHandlers: function()
    {
        var this1 = this;
    },

    prepareInputValidation: function()
    {
    },

    readList: function(callback) {
        $.get("/rest/admin/list.do", null, function(response) {
            console.log(response);
            callback(response);
        });
    },

    showList: function(list)
    {
        adminListManager.list = list;

        var params = {
            list: list,
            columns: [
                {name: "아이디", field: "admin_id", width: "150px"},
                {name: "성명", field: "name", align: "center", width: "100px"},
                {name: "등급", field: "grade", align: "center", width: "150px", fnFormat: adminListManager.formatGrade},
                {name: "권한중지", field: "locked", align: "center", width: "100px"}
            ],
            keyField: "admin_seq",
            rowLink: "update"
        };

        $("#div_admin_list").list("make", params);
    },

    applyFilter: function()
    {
        $("#div_member_list").list("setData", {list: adminListManager.list});
    },

    _applyButtonFilter: function(btn, list, fnValidator)
    {
        var result = [];

        for (var i in list)
        {
            if (fnValidator(list[i], btn.attr("data_status")))
            {
                result.push(list[i]);
            }
        }

        return result;
    },

    formatGrade: function(value, data)
    {
        if (value == 3)
        {
            return "일반관리자";
        }
        else if (value == 5)
        {
            return "최고관리자";
        }
        else if (value == 9)
        {
            return "Supervisor";
        }
        else
        {
            return "";
        }
    },

};

