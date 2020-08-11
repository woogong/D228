
$(document).ready(function() {

    initializeDateInput();
    
    $("#cmb_member").makeMemberCombo({searchInput: $("#txt_member")});

    $("#the_form").checkInputValidation({
        errorLayerClasses: "col-sm-4",
        errorLayerParent: "div.row"
    });


    $("#the_form").on("submit", function(event) {
        event.preventDefault();
        return false;
    });

    setEventHandlers();
});

function initializeDateInput()
{
    $("#txt_birthday").dateInput();
}

function setEventHandlers()
{
    $("#btn_save").on("click", function() {
        save();
    });

    $("#btn_id_make").on("click", function() {
        makeId();
    });

    $("#cmb_member").on("change", function() {
        var memberData = $("#cmb_member").getMemberData();
        
        if (memberData)
        {
            fillMemberData(memberData);
        }
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
                $.alert("유공자 등록", "유공자 정보를 등록하였습니다.", function() {
                    location.href = "list";
                });
            }
            else
            {
                $.alert("유공자 등록", "저장에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
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
    $.get("/rest/merit/new_id.do", null, function(response) {
        $("[name='meritId']").val(response);
    });
}

function fillMemberData(data)
{
    console.log("fillMemberData", data);

    $("#the_form [name='name']").val(data.name);
    $("#the_form [name='birthday']").val(data.birthday ? new Date(data.birthday).format("yyyy-MM-dd") : "");
    $("#the_form [name='zipcode']").val(data.zipcode);
    $("#the_form [name='address']").val(data.address);
    $("#the_form [name='phoneHome']").val(data.phone_home);
    $("#the_form [name='phoneMobile']").val(data.phone_mobile);
    $("#the_form [name='email']").val(data.email);
}


(function($) {

    var memberComboManager = null;

    $.fn.makeMemberCombo = function(settings) 
    {
        var defaultSettings = {};
        var option = $.extend({}, defaultSettings, settings || {});

        this.each(function() {
            memberComboManager = new MemberComboManager($(this), option);
            gMemberComboManagerArray.push(memberComboManager);
        });

        readMemberList(function(list) {
            gMemberList = list;
            for (var i in gMemberComboManagerArray)
            {
                gMemberComboManagerArray[i].showMemberList();
            }
        });

        return this;
    };

    $.fn.getMemberData = function()
    {
       return memberComboManager.getMemberData();
    };


    var gMemberList;
    var gMemberComboManagerArray = [];

    function MemberComboManager(combo, option) {
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

    MemberComboManager.prototype.applyFilter = function(query)
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

    MemberComboManager.prototype.showMemberList = function(query) {
        var list = this.applyFilter(query);

        this.combo.empty();

        this.makeOption({name: "없음", member_seq: 0});
        for (var i in list)
        {
            this.makeOption(list[i]);
        }
    };

    MemberComboManager.prototype.makeOption = function(data) {
        var option = $("<option />");
        option.attr("value", data.member_seq);

        var str = data.name + (data.member_id ? "(" + data.member_id + ")" : "") ;
        option.html(str);

        this.combo.append(option);
    };

    MemberComboManager.prototype.getMemberData = function(seq) {
        if (gMemberList)
        {
            for (var i in gMemberList)
            {
                if (gMemberList[i].member_seq == this.combo.val())
                {
                    return gMemberList[i];
                }
            }
        }
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