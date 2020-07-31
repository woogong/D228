
(function($) {
    
    $.fn.checkInputValidation = function()
    {
        var defaultSettings = {
            rules: {
                "required": {
                    errorMessage: "필수 입력 항목입니다.",
                    fnChecking: function(value) {
                        return (value && (value.trim().length > 0));
                    }
                },
                "yyyy-mm-dd": {
                    errorMessage: "yyyy-mm-dd 형식으로 입력하세요.",
                    fnChecking: function(value) {
                        if (!value || value.trim().length == 0)
                        {
                            return true;
                        }

                        return value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0[1-9]|[12]\d|3[01])$/);
                    }
                },
                "zipcode": {
                    errorMessage: "우편번호를 올바르게 입력하세요.",
                    fnChecking: function(value) {
                        if (!value || value.trim().length == 0)
                        {
                            return true;
                        }

                        return value.match(/^\d{5}$/);
                    }
                },
                "phoneNumber": {
                    errorMessage: "전화번호를 올바르게 입력하세요.",
                    fnChecking: function(value) {
                        if (!value || value.trim().length == 0)
                        {
                            return true;
                        }

                        return value.match(/^(\d{2,3}-)?\d{3,4}-\d{4}$/);
                    }
                },
                "mobilePhoneNumber": {
                    errorMessage: "휴대전화번호를 올바르게 입력하세요.",
                    fnChecking: function(value) {
                        if (!value || value.trim().length == 0)
                        {
                            return true;
                        }

                        return value.match(/^\d{3}-\d{3,4}-\d{4}$/);
                    }
                },
                "email": {
                    errorMessage: "이메일을 올바르게 입력하세요.",
                    fnChecking: function(value) {
                        if (!value || value.trim().length == 0)
                        {
                            return true;
                        }

                        return value.match(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i);
                    }
                },
            },
        };

        var job;
        var settings;

        if (typeof(arguments[0]) == "string")
        {
            job = arguments[0];
            settings = arguments[1];
        }
        else if (typeof(arguments[0]) == "object")
        {
            settings = arguments[0];
        }

        var options = $.extend({}, defaultSettings, settings || {});

        if ("isValid" == job)
        {
            var result = true;

            $(this).each(function() {
                var checker = FormChecker.getManager($(this));
                if (!checker.isValidFormData())
                {
                    result = false;
                    return;
                }
            });

            return result;
        }
        else
        {
            return $(this).each(function() {
                var checker = FormChecker.getManager($(this));
                checker.setOptions(options);
                checker.showWholeGuideMessages();
            });
        }
    };

    function FormChecker(form)
    {
        this.form = form;

        var this1 = this;
        this.form.find(".user_input_check").on("blur", function() {
            this1.isValidInputData($(this));
        });
    }

    FormChecker.prototype.setOptions = function(options)
    {
        this.options = options;
    };

    FormChecker.prototype.showWholeGuideMessages = function()
    {
        var rows = this.form.find(".user_input_check");
        
        var this1 = this;
        rows.each(function() {
            this1.showGuideMessage($(this));
        });
    };

    FormChecker.prototype.showGuideMessage = function(element, errorMessage)
    {
        var message = errorMessage || element.attr("data-guide-message");

        if (message)
        {
            var guideElement = this.getGuideMessageElement(element);
            guideElement.find(".message_element").html(message);

            guideElement.find(".message_element").removeClass("text-muted");
            guideElement.find(".message_element").removeClass("text-danger");

            if (errorMessage)
            {
                guideElement.find(".message_element").addClass("text-danger");
            }
            else
            {
                guideElement.find(".message_element").addClass("text-muted");
            }
        }
        else
        {
            var guideElement = element.closest("div.row").find(".guide_element");
            if (guideElement)
            {
                guideElement.find(".message_element").html("");
            }
        }
    };

    FormChecker.prototype.getGuideMessageElement = function(element)
    {
        var guideElement = element.closest("div.row").find(".guide_element");

        if (guideElement.length == 0)
        {
            guideElement = this.makeGuideElement(element);
        }

        return guideElement;
    };

    FormChecker.prototype.makeGuideElement = function(element)
    {
        var guideElement = $("<div class='col-sm-4 guide_element' style='padding-top: 5px;'></div>");
        var messageElement = $("<small class='form-text message_element'></small>");
        guideElement.append(messageElement);

        element.closest("div.row").append(guideElement);

        return guideElement;
    };

    FormChecker.prototype.isValidFormData = function()
    {
        var elements = this.form.find(".user_input_check");
        var result = true;
        
        var this1 = this;
        elements.each(function() {
            if (!this1.isValidInputData($(this)))
            {
                result = false;
                return;
            }
        });

        return result;
    };

    FormChecker.prototype.isValidInputData = function(element)
    {
        var value = element.val();

        var dataRule = element.attr("data-rule");
        if (dataRule)
        {
            var rules = dataRule.split(" ");

            for (var i in rules)
            {
                if (!this.isValidData(rules[i], value))
                {
                    var rule = this.options.rules[rules[i]];
                    this.showGuideMessage(element, rule.errorMessage);
                    return false;
                }
            }
        }

        var regex = element.attr("data-regex");
        if (regex)
        {
            regex = new RegExp(regex);

            if (!value.match(regex))
            {
                var message = element.attr("data-regex-message") || "데이터 형식이 올바르지 않습니다.";

                this.showGuideMessage(element, message);
                return false;
            }
        }

        var ruleApi = element.attr("data-rule-api");
        if (ruleApi)
        {
            var result = $.ajax({
                method: "POST",
                url: ruleApi,
                data: {value: element.val()},
                async: false,
                dataType: "text"
            }).responseText;

            if ("false" == result)
            {
                this.showGuideMessage(element, element.attr("data-rule-api-message") || "잘못된 값입니다.");
                return false;
            }
        }

        if (this.options.ajaxValidations)
        {
            for (var i in this.options.ajaxValidations)
            {
                if (element.is($(this.options.ajaxValidations[i].element)))
                {
                    var result = this.options.ajaxValidations[i].isValid.call(this);

                    if (!result)
                    {
                        this.showGuideMessage(element, this.options.ajaxValidations[i].failMessage || "잘못된 값입니다.");
                        return false;
                    }
                }
            }
        }

        this.showGuideMessage(element);

        return true;
    };

    FormChecker.prototype.isValidData = function(ruleName, value)
    {
        var rule = this.options.rules[ruleName];

        if (rule)
        {
            return rule.fnChecking.call(this, value);
        }
        else
        {
            return true;
        }
    };



	$.fn.checkUserInput = function(settings) {
		var option = $.extend({}, settings || {});
		
        var checker = new InputChecker($(this), option);
        
        return checker.execute();
	};	
	
	
	function InputChecker(form, option)
	{
		this.form = form;
		this.option = option;
	}

	InputChecker.prototype.execute = function()
	{
		var items = this.form.find(".user_input_check");
		var result = true;
		
		var this1 = this;
		items.each(function(index, item) {
			if (!this1.isValid($(item)))
			{
				result = false;
			}
		});
		
		return result;
	};

	InputChecker.prototype.isValid = function(item)
	{
		var conditions = item.attr("data-rule");
		var value = item.val();

		this.hideErrorMessage(item);

		if (conditions)
		{
			var rules = conditions.split(",");
			for (var i in rules)
			{
				if ("required" == rules[i])
				{
					if (!this.checkRequired(value))
					{
						this.showErrorMessage(item, "필수 입력 항목입니다.");
						return false;
					}
				}
			}
		}
		
		return true;
	};
	
	InputChecker.prototype.checkRequired = function(value)
	{
		return (value && value.trim().length > 0);
	};
	
	InputChecker.prototype.showErrorMessage = function(item, message)
	{
		var span = $("<span></span>");
		
		span.html(message);
		span.addClass("input_error_message");
		span.addClass("text-warning");
		span.css("margin-left", "10px");
		
		span.insertBefore(item);
	};
	
	InputChecker.prototype.hideErrorMessage = function(item)
	{
		var span = item.siblings(".input_error_message");
		if (span[0])
		{
			$(span[0].remove());
		}
	};


    var __formManagers = [];

    FormChecker.getManager = function(elem)
	{
		for (var i in __formManagers)
		{
			if (elem.is(__formManagers[i].form))
			{
				return __formManagers[i];
			}
		}
		
		return FormChecker.makeManager(elem);
	};

	FormChecker.makeManager = function(elem)
	{
		var manger = new FormChecker(elem);
		__formManagers.push(manger);
		
		return manger;
	};


})(jQuery);

