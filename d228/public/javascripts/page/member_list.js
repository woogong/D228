
$(document).ready(function() {
    memberListManager.setEventHandlers();
    memberListManager.readList(memberListManager.showList);

    memberListManager.prepareInputValidation();
});

var gThisYear = new Date().getFullYear();

var memberListManager = {

    setEventHandlers: function()
    {
        $("input[name='query']").on("change", function() {
            setTimeout(function() {memberListManager.applyFilter();}, 10);
        });

        $("#btn_membership_fee").on("click", function() {
            memberListManager.changeMembershipFeeStatus();
            setTimeout(function() {memberListManager.applyFilter();}, 10);
        });

        $("#btn_merit_filter").on("click", function() {
            memberListManager.changeMeritFilterStatus();
            setTimeout(function() {memberListManager.applyFilter();}, 10);
        });

        $("#btn_excel_register").on("click", function () {
            memberListManager.openExcelRegisterPopup();
        });

        $("#btn_excel_download").on("click", function () {
            memberListManager.doExcelDownload();
        });

        $("#modal_excel_register .btn_excel_save").on("click", function() {
            memberListManager.saveMeritByExcel();
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
        $.get("/rest/member/list.do", null, function(response) {
            console.log(response);
            callback(response);
        });
    },

    showList: function(list)
    {
        memberListManager.list = list;

        var params = {
            list: list,
            columns: [
                {name: "아이디", field: "member_id", align: "center", width: "120px"},
                {name: "성명", field: "name", align: "center", width: "100px"},
                {name: "회비납부", field: "fee_year", align: "center", width: "100px", fnFormat: memberListManager.formatMembershipFee},
                {name: "생년월일", field: "birthday", align: "center", width: "120px", fnFormat: memberListManager.formatDate},
                {name: "가입일", field: "register_date", align: "center", width: "120px", fnFormat: memberListManager.formatDate},
                {name: "휴대폰", field: "phone_mobile", align: "center", width: "120px"},
                {name: "비고", field: "note", width: "300px"},
            ],
            keyField: "member_seq",
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

        var filtered2;
        var feeStatus = $("#btn_membership_fee").attr("data_status");
        if ("A" == feeStatus)
        {
            filtered2 = filtered;
        }
        else
        {
            filtered2 = [];
            for (var i in filtered)
            {
                if ("Y" == feeStatus)
                {
                    if (filtered[i].fee_year == gThisYear)
                    {
                        filtered2.push(filtered[i]);
                    }
                }
                else
                {
                    if (filtered[i].fee_year != gThisYear)
                    {
                        filtered2.push(filtered[i]);
                    }
                }
            }
        }

        var filtered3;
        var meritStatus = $("#btn_merit_filter").attr("data_status");
        if ("A" == meritStatus)
        {
            filtered3 = filtered2;
        }
        else
        {
            filtered3 = [];
            for (var i in filtered2)
            {
                if ("Y" == meritStatus)
                {
                    if (filtered2[i].merit_seq)
                    {
                        filtered3.push(filtered2[i]);
                    }
                }
                else
                {
                    if (!filtered2[i].merit_seq)
                    {
                        filtered3.push(filtered2[i]);
                    }
                }
            }
        }

        $("#div_member_list").list("setData", {list:filtered3});
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

    changeMeritFilterStatus: function()
    {
        var btn = $("#btn_merit_filter");
        var status = btn.attr("data_status");

        if ("A" == status)
        {
            btn.html("유공자 - 등록");
            btn.attr("data_status", "Y");
        }
        else if ("Y" == status)
        {
            btn.html("유공자 - 미등록");
            btn.attr("data_status", "N");
        }
        else if ("N" == status)
        {
            btn.html("유공자 - 전체");
            btn.attr("data_status", "A");
        }
    },

    doExcelDownload: function()
    {
        var params = {
            query: $("input[name='query']").val(),
            feeFilter: $("#btn_membership_fee").attr("data_status"),
            meritFilter: $("#btn_merit_filter").attr("data_status"),
        };

        location.href = "/rest/excel/membership_list.do?" + $.param(params);
    },

    openExcelRegisterPopup: function()
    {
        $("#modal_excel_register").modal("show");
    },

    saveMeritByExcel: function()
    {
        var form = $("#form_excel_register");

        var this1 = this;
        var option = {
            dataType: "JSON",
            
            success: function(response) {
                if (response.resultCode == "Success")
                {
                    $.alert("회원등록", "회원 일괄 등록을 완료하였습니다.", function() {
                        location.reload();
                    });
                }
                else
                {
                    $.alert("회원등록", "회원 일괄 등록에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
                }
            },
            
            beforeSubmit: function() {
                return form.checkInputValidation("isValid");
            },
        };
        
        form.ajaxSubmit(option);
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

