
$(document).ready(function() {

    var urlParams = getUrlParams();

    if (!urlParams.merit_seq)
    {
        $.alert("유공자 상세 정보", "잘못된 접근입니다.", function() {
            location.href = "list";
        });
    }

    meritManager.init(urlParams.merit_seq);
});


var meritManager = {

    init: function(meritSeq)
    {
        $("#the_form").checkInputValidation({
            errorLayerClasses: "col-sm-4",
            errorLayerParent: "div.row"
        });
    
        $("#the_form").on("submit", function(event) {
            event.preventDefault();
            return false;
        });
    
        this.setEventHandlers();

        this.setMeritSeq(meritSeq);
    },

    setEventHandlers: function()
    {
        var this1 = this;
        $("#btn_save").on("click", function() {
            this1.save();
        });
    
        $("#btn_id_make").on("click", function() {
            this1.makeId();
        });
    
    },

    setMeritSeq: function(meritSeq)
    {
        this.meritSeq = meritSeq;

        this.read(function() {
            meritManager.showData();
        });

        $("#the_form [name='meritSeq']").val(this.meritSeq);
    },

    read: function(callback)
    {
        var this1 = this;
        $.post("/rest/merit/read.do", {meritSeq: this.meritSeq}, function(response) {
            console.log(response);
            this1.data = response;

            callback.call(this1);
        });
    },

    showData: function()
    {
        var items = $(".detail_data");

        items.each(function() {
            meritManager.showDetailData($(this));
        });

        $("#cmb_member").makeMemberCombo({searchInput: $("#txt_member"), seq: this.data['member_seq']});
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

        value = value || "";

        if (element[0].tagName == "INPUT" && element.attr("type") == "radio")
        {
            if (element.val() == value)
            {
                element.click();
            }
        }
        else
        {
            element.val(value);
        }
    },

    save: function()
    {
        var form = $("#the_form");
			
        var this1 = this;
        var option = {
            dataType: "JSON",
            
            success: function(response) {
                if (response.resultCode == "Success")
                {
                    $.alert("유공자정보변경", "저장하였습니다.", function() {
                        location.href = "list";
                    });
                }
                else
                {
                    $.alert("유공자정보변경", "저장에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
                }
            },
            
            beforeSubmit: function() {
                return form.checkInputValidation("isValid");
            },
        };
        
        form.ajaxSubmit(option);
    },

    makeId: function()
    {
        $.get("/rest/merit/new_id.do", null, function(response) {
            $("[name='meritId']").val(response);
        });
    },

    checkMeritIdDuplicated: function()
    {
        var value = $("#the_form [name='meritId']").val();

        if (value == meritManager.data.merit_id)
        {
            return true;
        }

        var result = $.ajax({
            method: "POST",
            url: "/rest/merit/merit_id_unique.do",
            data: {value: value},
            async: false,
            dataType: "text"
        }).responseText;

        return ("false" != result);
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


(function($) {

    $.fn.makeMemberCombo = function(settings) 
    {
        var defaultSettings = {};
        var option = $.extend({}, defaultSettings, settings || {});

        this.each(function() {
            var meritManager = new MemberManager($(this), option);
            gMemberManagerArray.push(meritManager);
        });

        readMeritList(function(list) {
            gMemberList = list;
            for (var i in gMemberManagerArray)
            {
                gMemberManagerArray[i].showMemberList();

                if (option.seq)
                {
                    gMemberManagerArray[i].setValue(option.seq);
                }
            }
        });

        return this;
    };

    $.fn.setMemberSeq = function(seq) 
    {
        this.each(function() {
            $(this).val(seq);
        });
    };


    var gMemberList;
    var gMemberManagerArray = [];

    function MemberManager(combo, option) {
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

    MemberManager.prototype.applyFilter = function(query)
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

    MemberManager.prototype.showMemberList = function(query) {
        var list = this.applyFilter(query);

        this.combo.empty();

        this.makeOption({name: "없음", merit_seq: 0});
        for (var i in list)
        {
            this.makeOption(list[i]);
        }
    };

    MemberManager.prototype.makeOption = function(data) {
        var option = $("<option />");
        option.attr("value", data.member_seq);

        var str = data.name + (data.member_id ? "(" + data.member_id + ")" : "") ;
        option.html(str);

        this.combo.append(option);
    };

    MemberManager.prototype.setValue = function(seq) {
        this.combo.val(seq);
    };

    function readMeritList(callback) 
    {
        $.get("/rest/member/list_simple.do", null, function(response) {
            if (callback)
            {
                callback(response);
            }
        });
    }


})(jQuery);