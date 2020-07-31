
(function($) {



    $.alert = function(title, content, fnClose)
    {
        title = title || "&nbsp;";
        content = content || "&nbsp;";

        alertManager.showAlertModal(title, content, fnClose);
    };

    var alertManager = {

        showAlertModal: function(title, content, fnClose) {
            this.alertLayer = this._getAlertTemplate();

            this.alertLayer.find(".modal-title").html(title);
            this.alertLayer.find(".modal-body").html(content);
            
            if (fnClose)
            {
                this.alertLayer.one("hidden.bs.modal", function() {
                    fnClose();
                });
            }

            this.alertLayer.modal("show");
        },

        hideAlertModal: function()
        {
            this.alertLayer.modal("hide");
        },

        _getAlertTemplate: function() {
            var template = $("#modal_alert");

            if (template.length == 0)
            {
                template = this._makeAlertTemplate();
            }

            return template;
        },

        _makeAlertTemplate: function() {
            var template = $(ALERT_HTLM);
            $("body").append(template);

            return template;
        },

        setOptions: function(options)
        {
            this.layer = $("#modal_alert");
            this.options = options;
        },
        
        showModal: function()
        {
            this.layer.find(".modal-title").html(this.options.title);
            this.layer.find(".modal-body").html(this.options.content);
            
            this.makeButtons();
            
            alertManager.layer.modal("show");
        },
        
        hideModal: function()
        {
            this.layer.modal("hide");
        },
        
        makeButtons: function() {
            this.layer.find(".modal-footer").empty();
            
            for (var i in this.options.buttons)
            {
                this.makeButton(this.options.buttons[i]);
            }
        },
        
        makeButton: function(button) {
            var btn = $("<button type='button' class='btn' data-dismiss='modal'></button>");
            
            button.type = button.type || "secondary";
            btn.addClass("btn-" + button.type);
            
            btn.html(button.value);
            
            if (button.callback)
            {
                btn.on("click", function() {
                    alertManager.hideModal();
                    alertManager.layer.one("hidden.bs.modal", function() {
                        button.callback();
                    });
                    
                });
            }
            
            this.layer.find(".modal-footer").append(btn);
        },
    };


    const ALERT_HTLM 
        = '	<div class="modal fade" tabindex="-1" role="dialog" id="modal_alert">' +
        '      <div class="modal-dialog modal-dialog-centered" role="document">' +
        '           <div class="modal-content">' +
        '               <div class="modal-header">' +
        '                   <h5 class="modal-title">&nbsp;</h5>' +
        '                   <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '                       <span aria-hidden="true">&times;</span>' +
        '                   </button>' +
        '               </div>' +
        '               <div class="modal-body">' +
        '                   <p>&nbsp;</p>' +
        '               </div>' +
        '               <div class="modal-footer">' +
        '                   <button type="button" class="btn btn-secondary btn_close" data-dismiss="modal">닫기</button>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>';

})(jQuery);

