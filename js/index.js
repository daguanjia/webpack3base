import "babel-polyfill";
import '../css/main.css';
import './modal.js'
import FastClick from 'fastclick'



(function () {
    FastClick.attach(document.body);
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var formtext='<div class="photo"><input class="h-input phone" type="number" name="photo" placeholder="请输入你用于支付的手机号码"></div><div class="code"><input type="number" class="c-input authCode" name="code" placeholder="请输入手机验证码"><a href="javascript:;" class="getTelCode istrue">发送验证码</a></div>';
    var success='<div class="imgbox"><img src="img/s.jpg" alt="s"></div> <p>彩金充值成功</p>';
    var warn='<div class="imgbox"><img src="img/e.jpg" alt="e"></div> <p>彩金充值失败</p>';
    var cpOrderId=formatDate('','yyyyMMdd')+RndNum(6);
    var timestamp=parseInt(new Date().getTime());
    var txOrderId,phone,price;
    var data={"businessType":1,"cpId":"P04","serviceId":"-HXHGEDX"};

    // var obj={"price":price,"mobile":phone,"uid":phone,"cpOrderId":cpOrderId,"sign":sign,"timestamp":timestamp};
    // var params=$.extend({},data,obj);
   
   
    /*验证码倒计时*/
   
    var InterValObj; 
    var Order;
    var ordercount=30;
    var count = 60;
    var curCount;
    $('body').on('click','.getTelCode', function (e) {
       phone=$('.phone').val();
       var t=reg.test(phone);
       var is=$(this).hasClass('istrue');
       if(!phone){
            alert('手机号码未输入');
            return;
       }
       if(t){
           if(is){
            sendMessage();
            sendcode();
            $(this).removeClass('istrue');
           }
       }else{
            alert('手机格式不正确');
       }
       return false;
    });
    $('body').on('click','.view_pop', function (e) {
        price=parseInt($(this).attr("data-id")*100);
    
        $.modal({
          title: "你正在使用"+price/100+"元话费充值"+price/200+"元彩金",
          text: formtext,
          autoClose: false,
          buttons: [
            { text: "确认充值", onClick: function(){
                var authCode=$('.authCode').val();
                var phones=$('.phone').val();
                if(!phones){
                    alert('请填写手机号');
                }else if(!authCode){
                    alert('请填写验证码');
                }else{
                    pay();
                }
            } },
          ]
        });
        return false;
    });
    $('body').on('click','.close', function (e) {
        $(".mask--visible").removeClass("mask--visible").remove();
        $(".dialog--visible").removeClass("dialog--visible").remove();
        window.clearInterval(InterValObj);
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
              { text: "订单查询", onClick: function(){ } },
            ]
        });
    }

    function msg_warn (msg){
        warn=warn+'<p style="color: #888;">原因：'+msg+'</p>'
        $.modal({
            text: warn,
        });
    }
   
    function formatDate(date, format) {
        var dt = (isNaN(date) || (!date)) ? (new Date()) : (new Date(parseInt(date)));
        var o = {
            "M+": dt.getMonth() + 1,                                        //月份
            "d+": dt.getDate(),                                             //日
            "h+": dt.getHours() % 12 == 0 ? 12 : dt.getHours() % 12,        //小时（12小时制）
            "H+": dt.getHours(),                                            //小时（24小时制）
            "m+": dt.getMinutes(),                                          //分
            "s+": dt.getSeconds(),                                          //秒
            "q+": Math.floor((dt.getMonth() + 3) / 3),                      //季度
            "S": dt.getMilliseconds()                                       //毫秒
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return format;
    }
    //产生随机数函数
    function RndNum(n){
        var rnd="";
        for(var i=0;i<n;i++)
            rnd+=Math.floor(Math.random()*10);
        return rnd;
    }
    function ajax(url, param) {
        return $.ajax({
            url: url,
            data: JSON.stringify(param) || {},
            dataType: "json",
            type:'POST'
        });
    }
    //获取验证码
    function sendcode(){
        cpOrderId=formatDate('','yyyyMMdd')+RndNum(6);
        timestamp=parseInt(new Date().getTime());
        var signString = "businessType1cpIdP04cpOrderId" + cpOrderId + "mobile" + phone+ "price"
        + price + "serviceId-HXHGEDXtimestamp" + timestamp + "uid" + phone
        + "M070&%Dz0H9l3Eou";
        var sign=md5(signString);
        var obj={"price":price,"mobile":phone,"uid":phone,"cpOrderId":cpOrderId,"sign":sign,"timestamp":timestamp};
        var params=$.extend({},data,obj);
        ajax('https://hfopen.3g.qq.com/SendAuthCode',params).done(function(res){
            var errCode=res.errCode;
            if(!errCode){
                txOrderId=res.txOrderId;
            }else{
                alert(res.errMsg);
            }
        }).fail(function(err){
            console.log(err)
        });
    }
    //扣费
    function pay(){
        var authCode=$(".authCode").val();
        timestamp=parseInt(new Date().getTime());
        var signString = "authCode" + authCode + "businessType1cpIdP04cpOrderId" + cpOrderId+ "serviceId-HXHGEDXtimestamp"
        + timestamp + "txOrderId" + txOrderId
        + "M070&%Dz0H9l3Eou";
        var sign=md5(signString);
        var obj={"txOrderId":txOrderId,"authCode":authCode,"cpOrderId":cpOrderId,"sign":sign,"timestamp":timestamp};
        var params=$.extend({},data,obj);
        ajax('https://hfopen.3g.qq.com/OpenService',params).done(function(res){
            var errCode=res.errCode;
            $(".mask--visible").removeClass("mask--visible").remove();
            $(".dialog--visible").removeClass("dialog--visible").remove();
            if(!errCode){
                txOrderId=res.txOrderId;
                $("#dialog-box").show();
                search();
            }else{
                msg_warn(msg.errMsg);
            }
        }).fail(function(err){
            console.log(err);
        });
    }
    function search(){
        curCount = ordercount;
        _searchorder();
        Order = window.setInterval(_searchorder, 5000); 
    }
    //查询订单
    function _searchorder(){
        var signString = "cpIdP04txOrderId"+txOrderId+"M070&%Dz0H9l3Eou";
        var sign=md5(signString);
        var params={"cpId":"P04","txOrderId":txOrderId,"sign":sign};
        if (curCount == 0) {                
            window.clearInterval(Order);
        }
        else {
            curCount=curCount-5;  
        }
        ajax('https://hfopen.3g.qq.com/OpenService',params).done(function(res){
            if(!res.errCode){
                $("#dialog-box").hide();
                window.clearInterval(Order);
                msg_success();
            }else{
                msg_warn(msg.errMsg);
            }
        }).fail(function(err){
            console.log(err);
        });
    }
})();