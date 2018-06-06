import '../css/main.css';
import './modal.js';

(function () {
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var formtext='<div class="photo"><input class="h-input phone" type="number" name="photo" placeholder="请输入你用于支付的手机号码"></div><div class="code"><input type="number" class="c-input" name="code" placeholder="请输入手机验证码"><a href="javascript:;" class="getTelCode istrue">发送验证码</a></div>';
    var success='<div class="imgbox"><img src="css/s.jpg" alt="s"></div> <p>彩金充值成功</p>';
    var warn='<div class="imgbox"><img src="css/e.jpg" alt="e"></div> <p>彩金充值失败</p>';
   
   
    /*验证码倒计时*/
   
    var InterValObj; 
    var count = 60;
    var curCount;
    $('body').on('click','.getTelCode', function (e) {
       var phone=$('.phone').val();
       var t=reg.test(phone);
       var is=$(this).hasClass('istrue');
       console.log(phone)
       if(!phone){
        console.log('手机号码未输入')
        return;
       }
       if(t){
           if(is){
            sendMessage();
            $(this).removeClass('istrue');
           }
       }else{
         console.log('手机格式不正确')
       }
       return false;
    });
    $('body').on('click','.view_pop', function (e) {
        $.modal({
          title: "你正在使用100元话费充值50元彩金",
          text: formtext,
          buttons: [
            { text: "下一步", onClick: function(){ console.log(1)} },
          ]
        });
        return false;
    });
    $('body').on('click','.close', function (e) {
        $(".mask--visible").removeClass("mask--visible").remove();
        $(".dialog--visible").removeClass("dialog--visible").remove();
        return false;
     });
    function sendMessage() {
    　  curCount = count;
        $(".getTelCode").text(curCount+'秒后重发');
        InterValObj = window.setInterval(SetRemainTime, 1000); 
    　　 
    }
    function SetRemainTime() {
        if (curCount == 0) {                
            window.clearInterval(InterValObj);
            $(".getTelCode").text("发送验证码");
            $(".getTelCode").addClass("istrue");
        }
        else {
            curCount--;
            $(".getTelCode").text(curCount+'秒后重发');
        }
    }

    function msg_success (){
        $.modal({
            text: success,
            buttons: [
              { text: "订单查询", onClick: function(){ console.log(1)} },
            ]
        });
    }
    function msg_warn (){
        $.modal({
            text: warn,
        });
    }

})();