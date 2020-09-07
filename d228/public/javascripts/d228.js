
$(document).ready(() => {
    gLoginManager.init();
});

var gLoginManager = {

    freePages: ['/login'],

	init: function() {
		this.setEventHandlers();
		this.prepareValidation();
		
		this.checkAuthorization();
	},
		
	setEventHandlers: function() {
		$("#btn_signout").on("click", function() {
			gLoginManager.doLogout();
		});

		$("#btn_login").on("click", function() {
			gLoginManager.doLogin();
		});
    },
    
    checkAuthorization: function()
    {
        var this1 = this;
        this._readUserInfo(function(response) {
            if (response.user)
            {
                this1.user = response.user;
            }

            if (!this1.hasAuthorization())
            {
                location.href = "/login";
            }
            else
            {
                this1.showUserArea();
            }
        });
    },
	
	showUserArea: function()
	{
        if (this.user)
        {
            $("#btn_signin").hide();
            $("#btn_signout").show();
        }
        else
        {
            $("#btn_signin").show();
            $("#btn_signout").hide();
        }
    },
    
    _readUserInfo: function(callback)
    {
        $.post("/rest/admin/user_info.do", null, function(response) {
            callback(response);
        })
    },
	
	prepareValidation: function()
	{
		$("#form_login").checkInputValidation();
	},
		
	doLogin: function()
	{
        var form = $("#form_login");
			
        var this1 = this;
        var option = {
            dataType: "JSON",
            
            success: function(response) {
                if (response.resultCode == "Success")
                {
                    location.href = "/member/list";
                }
                else
                {
                    $.alert("로그인", "등록되지 않은 아이디이거나, 비밀번호가 올바르지 않습니다.");
                }
            },
            
            beforeSubmit: function() {
                return form.checkInputValidation("isValid");
            },
        };
        
        form.ajaxSubmit(option);
    },
    
    doLogout: function()
    {
        $.post("/rest/admin/logout.do", null, function(response) {
            location.href = "/login";
        });
    },

    hasAuthorization: function()
    {
        var page = location.pathname;

        if (this.isFreePage(page))
        {
            return true;
        }

        if (!this.user)
        {
            return false;
        }

        if (page.indexOf("/admin") == 0)
        {
            return (this.user.grade > 3);
        }
        else
        {
            return true;
        }
        
    },

    isFreePage: function(page)
    {
        for (var i in this.freePages)
        {
            if (this.freePages[i] == page)
            {
                return true;
            }
        }

        return false;
    }

};


(function($) {

    $.fn.dateInput = function(options) {
        var settings = $.extend({}, options || {});

        return this.each(function() {
            $(this).on("keyup", function(event) {
                $(event.target).val(formatDate($(event.target).val()));
            });

            if (settings.defaultDate)
            {
                $(this).val(settings.defaultDate.format("yyyy-MM-dd"));
            }
        });
    };

    function formatDate(str)
    {
        var strDigits = removeNonDigits(str);

        if (strDigits.length > 3)
        {
            strDigits = appendChar(strDigits, 4, "-");
        }
        if (strDigits.length > 6)
        {
            strDigits = appendChar(strDigits, 7, "-");
        }

        if (strDigits.length > 10)
        {
            strDigits = strDigits.substring(0, 10);
        }

        if (strDigits.length == 10)
        {
            strDigits = validateDate(strDigits);
        }

        return strDigits;
    }

    function appendChar(str, index, ch)
    {
        if (str.length >= index)
        {
            var newStr = str.substring(0, index);
            newStr += ch;

            if (str.length != index)
            {
                newStr += str.substring(index);
            }

            return newStr;
        }
        else
        {
            return str;
        }
    }

    function validateDate(dateStr)
    {
        var date = parseDate(dateStr);
        return date.format("yyyy-MM-dd");
    }

    function removeNonDigits(str)
    {
        var strDigits = "";
        for (var i = 0 ; i < str.length ; i++)
        {
            var ch = str.charAt(i);
            if (ch >= '0' && ch <= '9')
            {
                strDigits += ch;
            }
        }

        return strDigits;
    }


}(jQuery));

