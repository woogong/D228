
$(document).ready(function() {
    
    var urlParams = getUrlParams();

    if (!urlParams.merit_seq)
    {
        $.alert("유공자 상세 정보", "잘못된 접근입니다.", function() {
            location.href = "list";
        });
    }

    meritManager.setEventHandlers();
    meritManager.setMeritSeq(urlParams.merit_seq);

});

var meritManager = {

    setEventHandlers: function()
    {
        var this1 = this;

        $("#btn_update").on("click", function() {
            this1.updateMerit();
        });

        $("#btn_remove").on("click", function() {
            this1.removeMerit();
        });

        $("#btn_membership").on("click", function() {
            this1.registerMembership();
        });
    },

    setMeritSeq: function(meritSeq)
    {
        this.meritSeq = meritSeq;

        this.read(function() {
            meritManager.showData();
        });
    },

    read: function(callback)
    {
        $.post("/rest/merit/read.do", {meritSeq: this.meritSeq}, function(response) {
            console.log(response);
            meritManager.data = response;

            callback.call(meritManager);
        });
    },

    showData: function()
    {
        var items = $(".detail_data");

        items.each(function() {
            meritManager.showDetailData($(this));
        });

        this.initMembershipRegisterButton();
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

    updateMerit: function()
    {
        location.href = "update?merit_seq=" + this.meritSeq;
    },

    removeMerit: function()
    {
        $.confirm("유공자정보삭제", "유공자 정보를 삭제하시겠습니까?", function() {
            $.post("/rest/merit/remove.do", {meritSeq: meritManager.meritSeq}, function(response) {
                if (response.resultCode = "Success")
                {
                    $.alert("유공자정보삭제", "삭제하였습니다.", function() {
                        location.href = "list";
                    });
                }
                else
                {
                    $.alert("유공자정보삭제", "삭제하지 못했습니다. " + (response.failMessage ? response.failMessage : ""));
                }
            });
        });
    },

    registerMembership: function()
    {
        var this1 = this;

        $.confirm("회원등록", "'" + this.data.name + "' 유공자를 회원으로 등록하시겠습니까?", function() {
            this1._saveMembership();
        });
    },

    _saveMembership: function()
    {
        var params = {
            name: this.data.name,
            birthday: this.data.birthday,
            zipcode: this.data.zipcode,
            address: this.data.address,
            phoneHome: this.data.phone_home,
            phoneMobile: this.data.phone_mobile,
            email: this.data.email,
            memberType: "C",
            meritSeq: this.data.merit_seq
        };

        $.post("/rest/member/register_by_merit.do", params, function(response) {
            var this1 = this;
            if (response.resultCode == "Success")
            {
                $.alert("회원등록", "'" + this.data.name + "' 유공자를 회원으로 등록했습니다.");
                location.reload();
            }
            else
            {
                $.alert("회원등록", "회원 등록에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
            }
        })
    },

    initMembershipRegisterButton: function()
    {
        if (this.data.member_seq)
        {
            $("#btn_membership").hide();
        }
        else
        {
            $("#btn_membership").show();
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

};

function formatLineBreak(value)
{
    if (value)
    {
        return value.replace(/\r?\n/g, '<br />');
    }
}

function formatMember(value, data)
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