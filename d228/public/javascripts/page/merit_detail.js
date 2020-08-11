
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