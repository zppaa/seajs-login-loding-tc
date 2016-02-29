define(function(require,exports, module){
  var $ = require('jquery');
  require('form');
  require('validate');
  require('tc');
  var lnv_api = lnv_api || {};

  (function () {
    var Login = function (config) {
      this.config = {
        dom:'login-con',
        formDom1:'username', //用户名信息
        formDom2:'password', //手机号
        formDom3:'vcode', //验证码
        phoFormDom1:'code-phone',
        phoFormDom2:'phone_vcode',
        isLogin:'',
        lock:'false', // 防止重复点击登录
        loginBtn:'#loginForm .btn',
        phoLoginBtn:'#loginCodeForm .btn',
        codeImg:'.code-img img',
        pasSee:'.eye', //密码是否可见元素
        pasNoSee:'eye-close', //密码不可见雷鸣
        remPswCheck:'.reme', //记住密码的复选框
        remPswCheckAct:'remend', //复选框选中后的类名
        userNameErrDom:'.err .username-error', //用户名错误提示信息dom
        userNameErr:['用户名不能为空','手机号或邮箱格式不正确'], //用户名错误提示信息
        passErrDom:'.err .password-error', //用户名错误提示信息dom
        passErr:['密码不能为空','6-16位数字、字母或常用符号，字母区分大小写'], //用户名错误提示信息
        onRender : ""//可选，监听dom渲染后
      };
      this.config  = $.extend(this.config, config);
      this.dom = $('.'+this.config.dom);
      this.__init();
    };
    Login.prototype = {
      __init:function (argument) {

        var me = this;
        me.__packHtml();
        $('.con').tc();
      },
      __packHtml:function (argument) {
        var me = this;

        var src = $(me.dom).data("src");
        $.ajax({
          type:'get',
          url:src,
          success:function(data){
            $(me.dom).html(data);
            me.__bingEvent();
            me.__isRememberPwd();
            me.__showHidePwd();
            me.__loginTab();
            me.__getNoteCode();
          }
        });
        if(typeof me.config.onRender == 'function') {
          me.config.onRender(me, html);
        }

      },
      //账号，短信登录来回切换
      __loginTab:function(){
        $(".login-nav li").click(function(ele,index){
          var index = $(this).index();
          //tab
          $(this).addClass('active').siblings('li').removeClass('active');

          //con
          $(".login-con .login-form").eq(index).removeClass('hide').addClass('show').siblings('.login-con .login-form').removeClass('show').addClass('hide');
        });
      },

      /* 是否记住密码 */
      __isRememberPwd:function(){
        var me = this;
        var remPswCheck = me.config.remPswCheck;
        var remPswCheckAct =  me.config.remPswCheckAct;
        $(remPswCheck).click(function(){
          if($(this).hasClass(remPswCheckAct)){
            $(this).removeClass(remPswCheckAct);
          }else{
            $(this).addClass(remPswCheckAct);
          }
        });
      },
      /* 密码是否可见 */
      __showHidePwd:function(){
        var me = this;
        $(".eye").click(function(){
          if($(this).hasClass('eye-close')){
            $(this).removeClass('eye-close');
            $(this).prev().attr("type","text");
          }else{
            $(this).addClass('eye-close');
            $(this).prev().attr("type","password");
          }
        });
      },
      //验证用户名是否正确
      __checkLogin:function (userNameVal,passVal) {
        var me = this;

        //手机邮箱验证 密码验证
        var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        var phonrReg = /^1[34578]\d{9}$/;
        var passReg = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\-_]{6,16}$/;
        if(!userNameVal){
          $(me.config.userNameErrDom).text(me.config.userNameErr[0]);
        }
        if(!passVal){
          $(me.config.passErrDom).text(me.config.passErr[0]);
          return;
        }
        if(!emailReg.test(userNameVal) && !phonrReg.test(userNameVal)){
          $(me.config.userNameErrDom).text(me.config.userNameErr[1]);
        }
        if(!passReg.test(passVal)){
          $(me.config.passErrDom).text(me.config.passErr[1]);
          return;
        }
        return false;

      },

      //随机验证码
      __changeCode:function(){
        var time = new Date().getTime();
        var codeUrl = $(".code-img img").attr("src");
        if(codeUrl.indexOf("time=")!=-1){
          var urlArr = codeUrl.split("?");
          var imgSrc = urlArr[0]+'?time='+time;
          $(".code-img img").attr("src",imgSrc);
        }else{
          var imgSrc = codeUrl+'?time='+time;
          $(".code-img img").attr("src",imgSrc);
        }
      },
      __bingEvent:function () {
        var me = this;
        var loginBtn = me.config.loginBtn;
        var codeImg = me.config.codeImg;
        //提交时验证
        $(loginBtn).on('click',function(){

          var userNameVal = document.getElementById(me.config.formDom1).value;
          var passVal = document.getElementById(me.config.formDom2).value;
          var vcode = document.getElementById(me.config.formDom3).value;
          me.__checkLogin(userNameVal,passVal);
          //ajax 提交
          if(!me.__checkLogin){
            var obj = {userNameVal:userNameVal,passVal:passVal,vcode:vcode}
            me.__login(obj);
          }

        });
        //鼠标失去焦点时验证鼠标获得焦点时提示消失

        $('#'+me.config.formDom1).on('focus',function(){

          $(me.config.userNameErrDom).text('');
        }).on('blur',function(){
            var userNameVal = document.getElementById(me.config.formDom1).value;
            var passVal = document.getElementById(me.config.formDom2).value;
            me.__checkLogin(userNameVal, passVal);
        });
        $('#'+me.config.formDom2).on('focus',function(){
          $(me.config.passErrDom).text('');
        }).on('blur',function(){
            var userNameVal = document.getElementById(me.config.formDom1).value;
            var passVal = document.getElementById(me.config.formDom2).value;
            me.__checkLogin(userNameVal, passVal);
        });
        //随机图片验证码
        $(me.config,codeImg).on('click',function(){
          me.__changeCode();
        });

        //手机登录提交
        $(me.config.phoLoginBtn).on('click',function(){
          var phone = document.getElementById(me.config.phoFormDom1).value;
          var phone_vcode = document.getElementById(me.config.phoFormDom2).value;
          var obj = {phone:phone,phone_vcode:phone_vcode}
          if(!phone_vcode){
            $('#'+me.config.phoFormDom2).prev().text("请输入短信验证码");
            return;
          }
          alert(1);
          me.__codeLogin(obj);
        });
      },
      __login:function(){
        $.ajax({
          url:"",
          data:obj,
          dataType:"json",
          beforeSend:function(){

          },
          success:function(res){

          },
          complete:function(){

          }
        });
      },
      //获得短信验证码
      __getNoteCode:function(){
        var timer=null;
        var num = 60;
        $(".get-code").click(function(){
          //$(document).tc({
          //  onRender:function(dom,html){
          //    var html = $('.login-con').html();
          //    $(".tc-con").append('<iframe src="about:blank" style="z-index: -1; width: 100%; height: 2954px; opacity: 0.4;" allowtransparency="true" frameborder="0"></iframe>');
          //    $(".tc-con").append('<div style="position：absolute;">'+html+'</div>');
          //    alert(1);
          //  }
          //});
          var _this = this;
          if($(_this).hasClass('get-code-end')){
            return false;
          }
          var phoneVal = $.trim($("#loginCodeForm .code-phone").val());
          var regPhone = /^1[34578]\d{9}$/;
          if(phoneVal==""){
            $(".code-phone").siblings(".err").html("手机号不能为空");
            return false;
          }
          if(!regPhone.test(phoneVal)){
            $(".code-phone").siblings(".err").html("手机号格式不正确");
            return false;
          }
          $(this).addClass('get-code-end').html("已发送（"+num+"s）");
          countDown(num,function(s){
            $(_this).addClass('get-code-end').html("已发送（"+s+"s）");
            if(s==0){
              $(_this).removeClass('get-code-end').html("重新获取验证码");
            }
          });
          // $.ajax({
          //      url:getNoteCodeUrl,
          //      type:"GET",
          //      dataType:ajaxMethod,
          //      data:{
          //          phone:phoneVal
          //      },
          //      beforeSend:function(){
          //          if(lock){
          //              return false;
          //          }
          //          lock=true;
          //      },
          //      success: function(res) {
          //          if(typeof res == 'string'){res=$.parseJSON(res);}
          //          if(res && res.code==0){
          //              //短信发送成功
          //          }else{

          //              $(_this).removeClass('get-code-end').html("重新获取验证码");
          //              clearInterval(timer);
          //          }
          //      },
          //      error: function() {
          //          $(".pop-top-fail").pop({
          //              msg:"网络出现错误",
          //              autoTime:2000,
          //              isAutoClose:true
          //          });
          //          $(_this).removeClass('get-code-end').html("重新获取验证码");
          //          clearInterval(timer);
          //      },
          //      complete: function(){
          //          lock=false;
          //      }
          //  });
        });


        function countDown(s,next){
          timer = setInterval(function(){
            s--;
            next(s);
            if(s==0){
              clearInterval(timer);
            }

          },1000);
        }
      },
      __codeLogin:function(){

      }
    }
    lnv_api.login = function () {
      return {
        init : function(config) {
          try{
            if(!config.dom || !$('.'+config.dom)){
              throw 'need dom';
            } else {
              return new Login(config);
            }
          } catch(x) {
            return x;
          }
        }
      }
    }();
  })();
  if(typeof module!="undefined" && module.exports){

    module.exports = lnv_api;

  }

});
