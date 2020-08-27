
(function($) {

    $.alert = function(title, content, fnClose)
    {
        title = title || "&nbsp;";
        content = content || "&nbsp;";

        alertManager.showAlertModal(title, content, fnClose);
    };

    $.confirm = function(title, content, fnOk, fnCancel)
    {
        title = title || "&nbsp;";
        content = content || "&nbsp;";

        alertManager.showConfirmModal(title, content, fnOk, fnCancel);
    };

    var alertManager = {

        showAlertModal: function(title, content, fnClose) {
            this.alertLayer = this._getAlertTemplate();

            this.alertLayer.find(".modal-title").html(title);
            this.alertLayer.find(".modal-body").html(content);
            
            if (fnClose)
            {
                this.alertLayer.off("hidden.bs.modal");
                this.alertLayer.on("hidden.bs.modal", function() {
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

        showConfirmModal: function(title, content, fnOk, fnCancel) {
            this.confirmLayer = this._getConfirmTemplate();

            this.confirmLayer.find(".modal-title").html(title);
            this.confirmLayer.find(".modal-body").html(content);
            
            var this1 = this;
            if (fnOk)
            {
                this.confirmLayer.find(".btn_ok").off("click");
                this.confirmLayer.find(".btn_ok").on("click", function() {
                    this1.hideConfirmModal();
                    fnOk();
                });
            }

            if (fnCancel)
            {
                this.confirmLayer.find(".btn_cancel").off("click");
                this.confirmLayer.find(".btn_cancel").on("click", function() {
                    this1.hideConfirmModal();
                    fnCancel();
                });
            }

            this.confirmLayer.modal("show");
        },

        hideConfirmModal: function()
        {
            this.confirmLayer.modal("hide");
        },

        _getConfirmTemplate: function() {
            var template = $("#modal_confirm");

            if (template.length == 0)
            {
                template = this._makeConfirmTemplate();
            }

            return template;
        },

        _makeConfirmTemplate: function() {
            var template = $(CONFIRM_HTLM);
            $("body").append(template);

            return template;
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

    const CONFIRM_HTLM 
        = '	<div class="modal fade" tabindex="-1" role="dialog" id="modal_confirm">' +
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
        '                   <button type="button" class="btn btn-secondary btn_cancel" data-dismiss="modal">아니오</button>' +
        '                   <button type="button" class="btn btn-primary btn_ok" data-dismiss="modal">예</button>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>';

})(jQuery);

