
$(document).ready(function() {
    
    var urlParams = getUrlParams();

    if (!urlParams.member_seq)
    {
        $.alert("회원 상세 정보", "잘못된 접근입니다.", function() {
            location.href = "list";
        });
    }

    memberManager.setMemberSeq(urlParams.member_seq);
});


var memberManager = {

    setMemberSeq: function(memberSeq)
    {
        this.memberSeq = memberSeq;

        this.read(function() {
            memberManager.showData();
        });
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