
$(document).ready(function() {

    initializeDateInput();
    
    $("#cmb_introducer").makeIntroducerCombo({searchInput: $("#txt_introducer")});

    $("#the_form").checkInputValidation({
        /* ajaxValidations: [
            {
                element: "[name='memberId']",
                isValid: function() {
                    var result = $.ajax({
                        method: "POST",
                        url: "/rest/member/member_id_exists.do",
                        data: {memberId: this.form.find("[name='memberId']").val()},
                        async: false,
                        dataType: "json"
                    }).responseText;

                    result = JSON.parse(result);

                    return (result.exists ? false : true);
                },
                failMessage: "중복된 아이디입니다."
            }
        ] */
    });


    $("#the_form").on("submit", function(event) {
        event.preventDefault();
        return false;
    });

    $("#btn_save").on("click", function() {
        save();
    });

    $("#btn_id_make").on("click", function() {
        makeId();
    });
});

function initializeDateInput()
{
    $("#txt_birthday").dateInput();
    $("#txt_register_date").dateInput({
        defaultDate: new Date()
    });
}

function save()
{
    var form = $("#the_form");
			
    var this1 = this;
    var option = {
        dataType: "JSON",
        
        success: function(response) {
            if (response.resultCode == "Success")
            {
                $.alert("회원 등록", "회원을 등록하였습니다.", function() {
                    location.href = "list";
                });
            }
            else
            {
                $.alert("회원 등록", "저장에 실패하였습니다.");
            }
        },
        
        beforeSubmit: function() {
            return form.checkInputValidation("isValid");
        },
    };
    
    form.ajaxSubmit(option);
}

function makeId()
{
    $.get("/rest/member/new_id.do", null, function(response) {
        $("[name='memberId']").val(response);
    });
}


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
            }
        });

        return this;
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