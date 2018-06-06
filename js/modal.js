+ function($) {
    "use strict";
  
    var defaults;
    
    $.modal = function(params, onOpen) {
      params = $.extend({}, defaults, params);
  
  
      var buttons = params.buttons;
  
      var buttonsHtml = buttons.map(function(d, i) {
        return '<button class="dialog__btn ' + (d.className || "") + '">' + d.text + '</button>';
      }).join("");
  
      var tpl = '<div class="dialog">' +
                  '<div class="dialog-title">' + params.title + '<div class="close">×</div></div>' +
                  ( params.text ? '<div class="content-box">'+params.text+'</div>' : '')+
                  '<div class="button-box">' + buttonsHtml + '</div>' +
                '</div>';
      
      var dialog = $.openModal(tpl, onOpen);
  
      dialog.find(".dialog__btn").each(function(i, e) {
        var el = $(e);
        el.click(function() {
          //先关闭对话框，再调用回调函数
          if(params.autoClose) $.closeModal();
  
          if(buttons[i].onClick) {
            buttons[i].onClick.call(dialog);
          }
        });
      });
  
      return dialog;
    };
  
    $.openModal = function(tpl, onOpen) {
      var mask = $("<div class='mask'></div>").appendTo(document.body);
    //   mask.show();
  
      var dialog = $(tpl).appendTo(document.body);
   
    //   if (onOpen) {
    //     dialog.transitionEnd(function () {
    //       onOpen.call(dialog);
    //     });
    //   }   
  
    //   dialog.show();
      mask.addClass("mask--visible");
      dialog.addClass("dialog--visible");
  
  
      return dialog;
    }
  
    $.closeModal = function() {
      $(".mask--visible").removeClass("mask--visible").remove();
      $(".dialog--visible").removeClass("dialog--visible").remove();
    };

  
    defaults = $.modal.prototype.defaults = {
      title: "",
      text: undefined,
      buttonOK: "确定",
      buttonCancel: "取消",
      buttons: [{
        text: "确定",
        className: "primary"
      }],
      autoClose: true //点击按钮自动关闭对话框，如果你不希望点击按钮就关闭对话框，可以把这个设置为false
    };
  
  }($);