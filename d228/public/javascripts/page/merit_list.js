
$(document).ready(function() {
    meritListManager.setEventHandlers();
    meritListManager.readList(meritListManager.showList);

    meritListManager.prepareInputValidation();
});

var gThisYear = new Date().getFullYear();

var meritListManager = {

    setEventHandlers: function()
    {
        var this1 = this;
        
        $("input[name='query']").on("change", function() {
            setTimeout(function() {meritListManager.applyFilter();}, 10);
        });

        $("#btn_membership_filter").on("click", function() {
            meritListManager.changeMemberFilterStatus();
            setTimeout(function() {meritListManager.applyFilter();}, 10);
        });

        $("#btn_excel").on("click", function () {
            this1.doExcelDownload();
        });

        $("#btn_excel_register").on("click", function () {
            this1.openExcelRegisterPopup();
        });

        $("#modal_excel_register .btn_excel_save").on("click", function() {
            this1.saveMembershipFeeByExcel();
        });

    },

    prepareInputValidation: function()
    {
        $("#form_excel_register").checkInputValidation({
            errorLayerClasses: "",
            errorLayerParent: "div.form-group",
        });
    },

    readList: function(callback) {
        $.get("/rest/merit/list.do", null, function(response) {
            console.log(response);
            callback(response);
        });
    },

    showList: function(list)
    {
        meritListManager.list = list;

        var params = {
            list: list,
            columns: [
                {name: "회원아이디", field: "member_id", align: "center", width: "150px"},
                {name: "연번", field: "merit_id", align: "center", width: "80px", fnSort: "number"},
                {name: "성명", field: "name", align: "center", width: "100px"},
                {name: "휴대전화", field: "phone_mobile", align: "center", width: "120px"},
                {name: "주민등록번호", field: "jumin_no", align: "center", width: "120px"},
                /*{name: "생년월일", field: "birthday", align: "center", width: "120px", fnFormat: meritListManager.formatDate},*/
                {name: "출신학교", field: "school", width: "150px"},
                {name: "기수", field: "graduate", width: "120px", align: "center"}
            ],
            keyField: "merit_seq",
            rowLink: "detail"
        };

        $("#div_member_list").list("make", params);
    },

    applyFilter: function()
    {
        var query = $("input[name='query']").val();

        var filtered = [];
        var data;
        for (var i in this.list)
        {
            data = this.list[i];

            if (this.applyQuery(data, ["member_id", 'name', 'job'], query))
            {
                filtered.push(data);
            }
        }

        filtered = this._applyButtonFilter($("#btn_membership_filter"), filtered, function(data, code) {
            if ("Y" == code)
            {
                return data.member_seq;
            }
            else if ("N" == code)
            {
                return !data.member_seq;
            }
            else
            {
                return true;
            }
        });

        $("#div_member_list").list("setData", {list: filtered});
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

    applyQuery: function(data, fields, query)
    {
        for (var i in fields)
        {
            if (data[fields[i]] && data[fields[i]].indexOf(query) >= 0)
            {
                return true;
            }
        }

        return false;
    },

    changeMembershipFeeStatus: function()
    {
        var btn = $("#btn_membership_fee");
        var status = btn.attr("data_status");

        if ("A" == status)
        {
            btn.html("회비납부 - 납부");
            btn.attr("data_status", "Y");
        }
        else if ("Y" == status)
        {
            btn.html("회비납부 - 미납부");
            btn.attr("data_status", "N");
        }
        else if ("N" == status)
        {
            btn.html("회비납부 - 전체");
            btn.attr("data_status", "A");
        }
    },

    openExcelRegisterPopup: function()
    {
        $("#modal_excel_register").modal("show");
    },

    saveMembershipFeeByExcel: function()
    {
        var form = $("#form_excel_register");

        var this1 = this;
        var option = {
            dataType: "JSON",
            
            success: function(response) {
                if (response.resultCode == "Success")
                {
                    $.alert("유공자등록", "유공자 목록 일괄 등록을 완료하였습니다.", function() {
                        location.reload();
                    });
                }
                else
                {
                    $.alert("유공자등록", "유공자 목록 일괄 등록에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
                }
            },
            
            beforeSubmit: function() {
                return form.checkInputValidation("isValid");
            },
        };
        
        form.ajaxSubmit(option);
    },

    changeMemberFilterStatus: function()
    {
        var btn = $("#btn_membership_filter");
        var status = btn.attr("data_status");

        if ("A" == status)
        {
            btn.html("회원여부 - 회원");
            btn.attr("data_status", "Y");
        }
        else if ("Y" == status)
        {
            btn.html("회원여부 - 비회원");
            btn.attr("data_status", "N");
        }
        else if ("N" == status)
        {
            btn.html("회원여부 - 전체");
            btn.attr("data_status", "A");
        }
    },

    doExcelDownload: function()
    {
        var params = {
            query: $("input[name='query']").val(),
            membershipFilter: $("#btn_membership_filter").attr("data_status"),
        };

        location.href = "/rest/excel/merit_list.do?" + $.param(params);
    },

    formatDate: function(value, data)
    {
        if (value)
        {
            var date = new Date(value);
            return date.format("yyyy.MM.dd");
        }
    },

    formatMembershipFee: function(value, data)
    {
        if (value == gThisYear)
        {
            return "O";
        }
        else
        {
            return "X";
        }
    },

};

