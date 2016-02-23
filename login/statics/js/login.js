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
        isLogin:'',
        lock:'false', // 防止重复点击登录
        loginBtn:'#loginForm .btn',
        codeImg:'.code-img img',
        pasSee:'.eye', //密码是否可见元素
        pasNoSee:'eye-close', //密码不可见雷鸣
        remPswCheck:'.reme', //记住密码的复选框
        remPswCheckAct:'remend', //复选框选中后的类名
        onRender : ""//可选，监听dom渲染后
      };
      this.config  = $.extend(this.config, config);
      this.dom = $('.'+this.config.dom);
      this.__init();
    };
    Login.prototype = {
      __init:function (argument) {

        var me = this;
        me.__checkInfo();
        me.__packHtml();
        $(document).tc();
      },
      __checkInfo:function(){
        //注册一个用户名验证规则
        jQuery.validator.addMethod("isPhoneEmail",function(value,element){

          return this.optional(element) || /^([a-z0-9]*[-_]?[a-z0-9]+)+@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z0-9]+([\.][a-z]+)?$/i.test(value) || /^1[34578]\d{9}$/.test(value);
        },"手机号或邮箱格式不正确");
        //注册一个密码验证规则
        jQuery.validator.addMethod("isPassWord",function(value,element){
          return this.optional(element) || /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\-_]{6,16}$/.test(value);
        },"6-16位数字、字母或常用符号，字母区分大小写");
        //注册一个密码验证规则
        jQuery.validator.addMethod("isPhone",function(value,element){
          return this.optional(element) || /^1[34578]\d{9}$/.test(value);
        },"手机号格式不正确");
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
      __checkLogin:function () {
        var me = this;
        //jquery.validate.js 插件表单验证
        $("#loginForm").validate({
          rules:{
            username: {
              required: true,
              isPhoneEmail:true
            },
            password: {
              required: true,
              isPassWord: true
            },
            vcode: {
              required: true,
              minlength: 6,
              maxlength: 6
            }
          },
          messages: {
            username: {
              required: "账号不能为空",
              isPhoneEmail: "手机号或邮箱格式不正确"
            },
            password: {
              required: "密码不能为空",
              isPassWord: "6-16位数字、字母或常用符号，字母区分大小写"
            },
            vcode: {
              required: "验证码不能为空",
              minlength: "验证码长度为6位",
              maxlength: "验证码长度为6位"
            }
          },
          errorPlacement:function(error,element){//验证不通过错误信息提示位置

            var oErr = element.siblings('.err');
            oErr.html(error);
          },
          success:function(lable){//验证通过提示位置
            var oErr = lable.siblings('.err');
            oErr.html("");
          },

          ignore: ".code"
        });

        // 准备好Options对象
        var options = {
          url: '',
          type: 'POST',
          beforeSubmit:function(){
            if(me.config.lock){
              return false;
            }
            me.config.lock = true;
            if($(me.config.remPswCheck).hasClass(me.constructor.remPswCheckAct)){
              $.cookie('mf_login_account', $("#username").val(), {expires: 30, path: '/'});
            }else{
              $.removeCookie('mf_login_account', { path: '/' });
            }
          },
          error:function(){

            $(".pop-top-fail").pop({
              msg:"网络异常",
              autoTime:2000,
              isAutoClose:true
            });
          },
          success: function(res) {
            if(typeof res == 'string'){res=$.parseJSON(res);}
            if(res && !res.code){
              //登陆成功
              //需要做弹窗提示和跳转

            }else{
              //错误提示
              //验证码显示
              //if(res.data.flag){
              //  $(".code-show-hide").removeClass('hide').addClass('show');
              //}
            }
            //changeCode(); 验证码随机
          },
          complete: function(){
            me.config.lock=false;
          }
        };

        // 将options传给ajaxForm
        //$("#loginForm").ajaxForm(options);
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
        $(loginBtn).on('click',function(){
          me.__checkLogin()
          if(me.__checkLogin()){
            $('#loginForm').submit();
            return false;
          }

        });
        $(me.config,codeImg).on('click',function(){
          me.__changeCode();
        });

      },
      //获得短信验证码
      __getNoteCode:function(){
        var timer=null;
        var num = 60;
        $(".get-code").click(function(){
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
