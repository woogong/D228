
$(document).ready(function() {
    
    var urlParams = getUrlParams();

    if (!urlParams.member_seq)
    {
        $.alert("회원 상세 정보", "잘못된 접근입니다.", function() {
            location.href = "list";
        });
    }

    memberManager.setEventHandlers();
    memberManager.prepareDateInput();
    memberManager.prepareInputValidation();
    memberManager.setMemberSeq(urlParams.member_seq);
    memberManager.makeFeeYearCombo();
});


var memberManager = {

    setEventHandlers: function()
    {
        var this1 = this;

        $("#btn_update").on("click", function() {
            this1.updateMembership();
        });

        $("#btn_remove").on("click", function() {
            this1.removeMembership();
        });

        $("#btn_membership_fee").on("click", function () {
            this1.openMembershipFeePopup();
        });

        $("#modal_register .btn_save").on("click", function() {
            this1.saveMembershipFee();
        });
    },

    prepareDateInput: function()
    {
        $("#form_register [name='feeDate']").dateInput({
            defaultDate: new Date()
        });
    },

    prepareInputValidation: function()
    {
        $("#form_register").checkInputValidation({
            errorLayerClasses: "",
            errorLayerParent: "div.form-group",
        });
    },

    setMemberSeq: function(memberSeq)
    {
        this.memberSeq = memberSeq;

        this.read(function() {
            memberManager.showData();
        });

        $("#form_register [name='memberSeq']").val(this.memberSeq);
    },

    read: function(callback)
    {
        $.post("/rest/member/read.do", {memberSeq: this.memberSeq}, function(response) {
            console.log(response);
            memberManager.data = response;

            callback.call(memberManager);
        });
    },

    showData: function()
    {
        var items = $(".detail_data");

        items.each(function() {
            memberManager.showDetailData($(this));
        });

        if (this.data['member_type'] == "S")
        {
            $(".student").show();
        }
        else
        {
            $(".student").hide();
        }

        this.showMembershipFeeList();
    },

    showDetailData: function(element)
    {
        var field = element.attr("data-field");
        var formatFn = element.attr("data-format");
        var value = this.data[field];

        if (formatFn)
        {
            value = eval(formatFn).call(this, value, this.data);
        }

        value = value || "&nbsp;";

        element.html(value);
    },

    showMembershipFeeList: function()
    {
        var params = {
            caller: this,
            list: this.data.membershipFeeList,
            columns: [
                {name: "입금일", field: "pay_date", align: "center", width: "100px", fnFormat: memberManager.formatDate},
                {name: "입금액", field: "amount", align: "right", width: "80px", fnFormat: memberManager.formatAmount},
                {name: "년도", field: "year", align: "center", width: "80px"},
                {name: "납부방법", field: "type", align: "center", width: "120px"},
                {name: "삭제", value: "삭제", align: "center", width: "50px", fnHtml: memberManager.htmlIconTrash, fnSelect: memberManager.deleteMembershipFee, keyField: 'fee_seq', caller: this},
            ],
            keyField: "fee_seq",
            fnSelect: memberManager.updateMembershipFee
        };

        $("#div_membership_fee").list("make", params);

    },

    updateMembership: function()
    {
        location.href = "update?member_seq=" + this.memberSeq;
    },

    removeMembership: function()
    {
        $.confirm("회원정보삭제", "회원 정보를 삭제하시겠습니까?", function() {
            $.post("/rest/member/remove.do", {memberSeq: memberManager.memberSeq}, function(response) {
                if (response.resultCode = "Success")
                {
                    $.alert("회원정보삭제", "삭제하였습니다.", function() {
                        location.href = "list";
                    });
                }
                else
                {
                    $.alert("회원정보삭제", "삭제하지 못했습니다. " + (response.failMessage ? response.failMessage : ""));
                }
            });
        });
    },

    openMembershipFeePopup: function()
    {
        var form = $("#form_register");

        memberManager.flagUpdate = false;
        $("#modal_register .btn_save").html("등록");

        form.find("[name='feeDate']").val(new Date().format("yyyy-MM-dd"));
        form.find("[name='year']").val(new Date().getFullYear());
        form.find("[name='feeSeq']").val(0);
        form.find("[name='amount']").val("");
        form.find("[name='type']").val("");
        form.find("[name='note']").val("");

        $("#modal_register").modal("show");
    },

    removeMembershipFeeData: function(feeSeq)
    {
        var feeData = this.getMembershipFee(feeSeq);

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

        memberManager.openMembershipFeePopup();

        memberManager.flagUpdate = true;
        form.find("[name='feeSeq']").val(feeSeq);
        
        var feeData = memberManager.getMembershipFee(feeSeq);

        form.find("[name='feeDate']").val(new Date(feeData.pay_date).format("yyyy-MM-dd"));
        form.find("[name='amount']").val(feeData.amount);
        form.find("[name='year']").val(feeData.year);
        form.find("[name='type']").val(feeData.type);
        form.find("[name='note']").val(feeData.note);

        $("#modal_register .btn_save").html("수정");
    },

    getMembershipFee: function(feeSeq)
    {
        var list = this.data.membershipFeeList;

        for (var i in list)
        {
            if (list[i].fee_seq == feeSeq)
            {
                return list[i];
            }
        }
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

    formatDate: function(value)
    {
        var date = new Date(value);

        if (!isNaN(date.getTime()))
        {
            return date.format("yyyy-MM-dd");
        }
    },

    formatAmount: function(value)
    {
        return formatNumber(value) + "원";
    },

    htmlIconTrash: function(column, data)
    {
        var icon = $("#div_icon .bi-trash").clone();

        var this1 = this;
        icon.on("click", function(event) {
            event.stopPropagation();
            event.preventDefault();

            memberManager.removeMembershipFeeData(data.fee_seq);
        });

        return icon;
    }
};

function formatMemberType(value)
{
    if ("P" == value)
    {
        return "후원회원";
    }
    else if ("F" == value)
    {
        return "가족회원";
    }
    else if ("S" == value)
    {
        return "학생회원";
    }
    else
    {
        return "일반회원";
    }
}

function formatRegularYn(value)
{
    if ("Y" == value)
    {
        return "정회원";
    }
    else
    {
        return "준회원";
    }
}

function formatGender(value)
{
    if ("M" == value)
    {
        return "남";
    }
    else if ("F" == value)
    {
        return "여";
    }
}

function formatLineBreak(value)
{
    if (value)
    {
        return value.replace(/\r?\n/g, '<br />');
    }
}

function formatIntroducer(value, data)
{
    var str = "";

    if (data["introducer_name"])
    {
        str += data["introducer_name"];
    }
    if (data["introducer_id"])
    {
        str += "(" + data["introducer_id"] + ")";
    }

    return str;
}

function formatDate(value)
{
    var date = new Date(value);

    if (!isNaN(date.getTime()))
    {
        return date.format("yyyy년 MM월 dd일");
    }
}