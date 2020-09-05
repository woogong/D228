
$(document).ready(function() {
    feeListManager.setEventHandlers();
    feeListManager.readList(feeListManager.showList);

    feeListManager.prepareInputValidation();

    $("#cmb_member").makeMemberCombo({searchInput: $("#txt_member_search")});
});

var gThisYear = new Date().getFullYear();

var feeListManager = {

    setEventHandlers: function()
    {
        var this1 = this;

        $("input[name='query']").on("change", function() {
            setTimeout(function() {feeListManager.applyFilter();}, 10);
        });

        $("#btn_register").on("click", function () {
            this1.openMembershipFeePopup();
        });

        $("#btn_excel_register").on("click", function () {
            this1.openExcelRegisterPopup();
        });

        $("#btn_excel").on("click", function () {
            this1.doExcelDownload();
        });

        $("#modal_register .btn_save").on("click", function() {
            this1.saveMembershipFee();
        });

        $("#modal_register .btn_remove").on("click", function() {
            this1.removeMembershipFeeData();
        });

        $("#modal_excel_register .btn_excel_save").on("click", function() {
            this1.saveMembershipFeeByExcel();
        });
    },

    readList: function(callback) {
        $.post("/rest/member/membership_fee_list.do", null, function(response) {
            console.log(response);
            feeListManager.data = response;
            callback(response);
        });
    },

    showList: function(list)
    {
        feeListManager.list = list;

        var params = {
            list: list,
            columns: [
                {name: "아이디", field: "member_id", align: "center", width: "120px"},
                {name: "납부일", field: "pay_date", align: "center", width: "150px", fnFormat: feeListManager.formatDate},
                {name: "성명", field: "member_name", align: "center", width: "100px"},
                {name: "납부금액", field: "amount", align: "right", width: "120px", fnFormat: feeListManager.formatAmount, fnSort: 'number'},
                {name: "납입방법", field: "type", align: "center", width: "120px"},
                {name: "년도", field: "year", align: "center", width: "100px"},
                {name: "비고", field: "note", width: "*"},
            ],
            keyField: "fee_seq",
            fnSelect: feeListManager.updateMembershipFee
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

            if (this.applyQuery(data, ["member_id", 'member_name', 'year', 'pay_date', 'note'], query))
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

        $("#div_member_list").list("setData", {list:filtered2});
    },

    applyQuery: function(data, fields, query)
    {
        for (var i in fields)
        {
            if (data[fields[i]] && ("" + data[fields[i]]).indexOf(query) >= 0)
            {
                return true;
            }
        }

        return false;
    },

    prepareInputValidation: function()
    {
        $("#form_register").checkInputValidation({
            errorLayerClasses: "",
            errorLayerParent: "div.form-group",
        });

        $("#form_excel_register").checkInputValidation({
            errorLayerClasses: "",
            errorLayerParent: "div.form-group",
        });
    },

    openMembershipFeePopup: function()
    {
        var form = $("#form_register");

        feeListManager.flagUpdate = false;
        $("#modal_register .btn_save").html("등록");

        form.find("[name='feeDate']").val(new Date().format("yyyy-MM-dd"));
        form.find("[name='year']").val(new Date().getFullYear());
        form.find("[name='feeSeq']").val(0);
        form.find("[name='amount']").val("");
        form.find("[name='type']").val("");
        form.find("[name='note']").val("");

        $("#modal_register .btn_remove").hide();
        $("#modal_register").modal("show");
    },

    removeMembershipFeeData: function()
    {
        var feeSeq = $("#form_register [name='feeSeq']").val();
        var feeData = feeListManager.getMembershipFee(feeSeq);

        if (feeData)
        {
            $.confirm("회비", "회비 납부 내역을 삭제하시겠습니까?", function() {
                $.post("/rest/member/membership_fee_delete.do", {feeSeq: feeSeq}, function(response) {
                    if (response.resultCode == "Success")
                    {
                        $.alert("회비", "회비 납부 내역을 삭제하였습니다.", function() {
                            location.reload();
                        });
                    }
                    else
                    {
                        $.alert("회비", "회비 납부 내역을 삭제하지 못했습니다. " + (response.failMessage ? response.failMessage : ""));
                    }
                });
            });
        }
    },

    saveMembershipFee: function()
    {
        var form = $("#form_register");

        if (!this.flagUpdate)
        {
            form.attr("action", "/rest/member/membership_fee_register.do");
        }
        else
        {
            form.attr("action", "/rest/member/membership_fee_update.do");
        }
			
        var this1 = this;
        var option = {
            dataType: "JSON",
            
            success: function(response) {
                if (response.resultCode == "Success")
                {
                    $.alert("회비 납부", "회비 납부 정보를 저장했습니다.", function() {
                        location.reload();
                    });
                }
                else
                {
                    $.alert("회비 납부", "저장에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
                }
            },
            
            beforeSubmit: function() {
                return form.checkInputValidation("isValid");
            },
        };
        
        form.ajaxSubmit(option);
    },

    updateMembershipFee: function(feeSeq)
    {
        var form = $("#form_register");

        feeListManager.openMembershipFeePopup();

        feeListManager.flagUpdate = true;
        form.find("[name='feeSeq']").val(feeSeq);
        
        var feeData = feeListManager.getMembershipFee(feeSeq);

        form.find("[name='memberSeq']").val(feeData.member_seq);
        form.find("[name='feeDate']").val(new Date(feeData.pay_date).format("yyyy-MM-dd"));
        form.find("[name='amount']").val(feeData.amount);
        form.find("[name='year']").val(feeData.year);
        form.find("[name='type']").val(feeData.type);
        form.find("[name='note']").val(feeData.note);

        $("#modal_register .btn_remove").show();
        $("#modal_register .btn_save").html("수정");
    },

    getMembershipFee: function(feeSeq)
    {
        var list = feeListManager.data;

        for (var i in list)
        {
            if (list[i].fee_seq == feeSeq)
            {
                return list[i];
            }
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
                    $.alert("회비납부", "회비 납부 일괄 등록을 완료하였습니다.", function() {
                        location.reload();
                    });
                }
                else
                {
                    $.alert("회비납부", "회비 납부 일괄 등록에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
                }
            },
            
            beforeSubmit: function() {
                return form.checkInputValidation("isValid");
            },
        };
        
        form.ajaxSubmit(option);
    },

    doExcelDownload: function()
    {
        var params = {
            query: $("input[name='query']").val()
        };

        location.href = "/rest/excel/membership_fee_list.do?" + $.param(params);
    },

    makeFeeYearCombo: function()
    {
        $("#cmb_year").empty();

        var thisYear = new Date().getFullYear();

        for (var i = thisYear + 1 ; i > 2018; i--)
        {
            var option = $("<option></option");
            option.attr("value", i);
            option.html(i + "년");

            if (i == thisYear)
            {
                option.attr("selected", "selected");
            }

            $("#cmb_year").append(option);
        }
    },

    formatDate: function(value, data)
    {
        if (value)
        {
            var date = new Date(value);
            return date.format("yyyy.MM.dd");
        }
    },

    formatAmount: function(value, data)
    {
        if (value)
        {
            return formatNumber(value);
        }
    },

};


(function($) {

    $.fn.makeMemberCombo = function(settings) 
    {
        var defaultSettings = {};
        var option = $.extend({}, defaultSettings, settings || {});

        this.each(function() {
            var memberSearchManager = new MemberSearchManager($(this), option);
            gMemberSearchManagerArray.push(memberSearchManager);
        });

        readMemberList(function(list) {
            gMemberList = list;
            for (var i in gMemberSearchManagerArray)
            {
                gMemberSearchManagerArray[i].showMemberList();
            }
        });

        return this;
    };


    var gMemberList;
    var gMemberSearchManagerArray = [];

    function MemberSearchManager(combo, option) {
        this.combo = combo;
        this.option = option;

        var this1 = this;
        if (this.option.searchInput)
        {
            this.option.searchInput.on("change", function() {
                this1.showMemberList($(this).val());
            });
        }
    }

    MemberSearchManager.prototype.applyFilter = function(query)
    {
        if (query)
        {
            var list = [];
            for (var i in gMemberList)
            {
                if (gMemberList[i].name.indexOf(query) >= 0)
                {
                    list.push(gMemberList[i]);
                }
            }
    
            return list;
        }
        else
        {
            return gMemberList;
        }
    };

    MemberSearchManager.prototype.showMemberList = function(query) {
        var list = this.applyFilter(query);

        this.combo.empty();

        for (var i in list)
        {
            this.makeOption(list[i]);
        }
    };

    MemberSearchManager.prototype.makeOption = function(data) {
        var option = $("<option />");
        option.attr("value", data.member_seq);

        var str = data.name + (data.member_id ? "(" + data.member_id + ")" : "") ;
        option.html(str);

        this.combo.append(option);
    };

    function readMemberList(callback) 
    {
        $.get("/rest/member/list_simple.do", null, function(response) {
            if (callback)
            {
                callback(response);
            }
        });
    }


})(jQuery);