
$(document).ready(function() {

    var urlParams = getUrlParams();

    if (!urlParams.member_seq)
    {
        $.alert("회원 상세 정보", "잘못된 접근입니다.", function() {
            location.href = "list";
        });
    }

    memberManager.init(urlParams.member_seq);
});


var memberManager = {

    init: function(memberSeq)
    {
        this.initializeDateInput();
    
        $("#the_form").checkInputValidation({
            errorLayerClasses: "col-sm-4",
            errorLayerParent: "div.row"
        });
    
        $("#the_form").on("submit", function(event) {
            event.preventDefault();
            return false;
        });
    
        this.setEventHandlers();

        this.setMemberSeq(memberSeq);
    },

    initializeDateInput: function()
    {
        $("#txt_birthday").dateInput();
        $("#txt_register_date").dateInput();
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
    
        $("[name=memberType]").on("click", function() {
            this1.applyMemberType($(this).val());
        });
        $("#rd_type_m").click();
    },

    applyMemberType: function(type)
    {
        if ("S" == type)
        {
            $("#the_form .student").show();
        }
        else
        {
            $("#the_form .student").hide();
        }
    },

    setMemberSeq: function(memberSeq)
    {
        this.memberSeq = memberSeq;

        this.read(function() {
            memberManager.showData();
        });

        $("#the_form [name='memberSeq']").val(this.memberSeq);
    },

    read: function(callback)
    {
        var this1 = this;
        $.post("/rest/member/read.do", {memberSeq: this.memberSeq}, function(response) {
            console.log(response);
            this1.data = response;

            callback.call(this1);
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

        $("#cmb_introducer").makeIntroducerCombo({searchInput: $("#txt_introducer"), seq: this.data['introducer_seq']});
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
                    $.alert("회원정보변경", "저장하였습니다.", function() {
                        location.href = "list";
                    });
                }
                else
                {
                    $.alert("회원정보변경", "저장에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
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
        $.get("/rest/member/new_id.do", null, function(response) {
            $("[name='memberId']").val(response);
        });
    },

    checkMemberIdDuplicated: function()
    {
        var value = $("#the_form [name='memberId']").val();

        if (value == memberManager.data.member_id)
        {
            return true;
        }

        var result = $.ajax({
            method: "POST",
            url: "/rest/member/member_id_unique.do",
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

    $.fn.makeIntroducerCombo = function(settings) 
    {
        var defaultSettings = {};
        var option = $.extend({}, defaultSettings, settings || {});

        this.each(function() {
            var introducerManager = new IntroducerManager($(this), option);
            gIntroducerManagerArray.push(introducerManager);
        });

        readMemberList(function(list) {
            gMemberList = list;
            for (var i in gIntroducerManagerArray)
            {
                gIntroducerManagerArray[i].showMemberList();

                if (option.seq)
                {
                    gIntroducerManagerArray[i].setValue(option.seq);
                }
            }
        });

        return this;
    };

    $.fn.setIntroducerSeq = function(seq) 
    {
        this.each(function() {
            $(this).val(seq);
        });
    };


    var gMemberList;
    var gIntroducerManagerArray = [];

    function IntroducerManager(combo, option) {
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

    IntroducerManager.prototype.applyFilter = function(query)
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

    IntroducerManager.prototype.showMemberList = function(query) {
        var list = this.applyFilter(query);

        this.combo.empty();

        this.makeOption({name: "없음", member_seq: 0});
        for (var i in list)
        {
            this.makeOption(list[i]);
        }
    };

    IntroducerManager.prototype.makeOption = function(data) {
        var option = $("<option />");
        option.attr("value", data.member_seq);

        var str = data.name + (data.member_id ? "(" + data.member_id + ")" : "") ;
        option.html(str);

        this.combo.append(option);
    };

    IntroducerManager.prototype.setValue = function(seq) {
        this.combo.val(seq);
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