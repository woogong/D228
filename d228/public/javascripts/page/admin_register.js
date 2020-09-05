
$(document).ready(function() {

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

function setEventHandlers()
{
    $("#btn_save").on("click", function() {
        save();
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
                $.alert("관리자 등록", "관리자 정보를 등록하였습니다.", function() {
                    location.href = "list";
                });
            }
            else
            {
                $.alert("관리자 등록", "저장에 실패하였습니다. " + (response.failMessage ? response.failMessage : ""));
            }
        },
        
        beforeSubmit: function() {
            return form.checkInputValidation("isValid");
        },
    };
    
    form.ajaxSubmit(option);
}

