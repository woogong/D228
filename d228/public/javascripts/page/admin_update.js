
$(document).ready(function() {

    var urlParams = getUrlParams();

    if (!urlParams.admin_seq)
    {
        $.alert("관리자 상세 정보", "잘못된 접근입니다.", function() {
            location.href = "list";
        });
    }

    adminManager.init(urlParams.admin_seq);
});


var adminManager = {

    init: function(adminSeq)
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

        this.setAdminSeq(adminSeq);
    },

    setEventHandlers: function()
    {
        var this1 = this;
        $("#btn_save").on("click", function() {
            this1.save();
        });
    },

    setAdminSeq: function(adminSeq)
    {
        this.adminSeq = adminSeq;

        this.read(function() {
            adminManager.showData();
        });

        $("#the_form [name='adminSeq']").val(this.adminSeq);
    },

    read: function(callback)
    {
        var this1 = this;
        $.post("/rest/admin/read.do", {adminSeq: this.adminSeq}, function(response) {
            console.log(response);
            this1.data = response;

            callback.call(this1);
        });
    },

    showData: function()
    {
        var items = $(".detail_data");

        items.each(function() {
            adminManager.showDetailData($(this));
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

        value = value || "";

        if (element[0].tagName == "INPUT" && (element.attr("type") == "radio" || element.attr("type") == "checkbox"))
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
                    $.alert("관리자정보변경", "저장하였습니다.", function() {
                        location.href = "list";
                    });
                }
                else
                {
                    $.alert("관리자정보변경", "저장에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
                }
            },
            
            beforeSubmit: function() {
                return form.checkInputValidation("isValid");
            },
        };
        
        form.ajaxSubmit(option);
    },

    checkAdminIdDuplicated: function()
    {
        var value = $("#the_form [name='adminId']").val();

        if (value == adminManager.data.admin_id)
        {
            return true;
        }

        var result = $.ajax({
            method: "POST",
            url: "/rest/admin/admin_id_unique.do",
            data: {value: value},
            async: false,
            dataType: "text"
        }).responseText;

        return ("false" != result);
    },

    formatGrade: function(value)
    {
        if (value == 3)
        {
            return "일반관리자";
        }
        else if (value == 5)
        {
            return "최고관리자";
        }
        else if (value == 9)
        {
            return "Supervisor";
        }
        else
        {
            return "";
        }
    },

};

