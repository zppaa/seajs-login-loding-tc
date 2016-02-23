<ul class="login-nav">
    <li class="active">账号登录</li>
    <li>短信登录</li>
</ul>
<div class="login-form show">
    <form id="loginForm" name="loginForm" method="post" action="" autocomplete="off" novalidate="novalidate">
        <div class="line">
            <div class="err"></div>
            <span class="uc-username-icon"></span>
            <input type="text" class="input" placeholder="邮箱/手机号" id="username" name="username">
        </div>
        <div class="line">
            <div class="err"></div>
            <span class="uc-password-icon"></span>
            <input type="password" class="input" placeholder="请输入密码" id="password" name="password">
            <s class="eye eye-close"></s>
        </div>
        <!-- show hide -->
        <div class="line code-show-hide {if $loginShowCaptcha}show {else}hide{/if} clearfix">
            <div class="err"></div>
            <input type="text" class="input code vcode" placeholder="请输入验证码" id="vcode" name="vcode">
            <span class="code-img"><img src="statics/images/captcha.png" alt=""></span>
        </div>
        <div class="line line-rmb clearfix">
            <p class="rmb l"><span class="reme remend"></span>记住我</p>
            <p class="forget r"><a href="/home/forgetpassword/index">忘记密码</a></p>
        </div>
        <div class="line line-btn">
            <input type="button" class="btn" value="登录">
        </div>
    </form>
</div>
<div class="login-form hide">
    <form id="loginCodeForm" name="loginCodeForm" method="post" action="" autocomplete="off" novalidate="novalidate">
        <div class="line">
            <div class="err"></div>
            <span class="uc-mobile-icon"></span>
            <input type="text" class="input code-phone" placeholder="请输入手机号" name="phone">
        </div>

        <div class="line clearfix">
            <div class="err"></div>
            <input type="text" class="input code" name="phone_vcode" placeholder="请输入短信验证码">
            <span class="get-code">获取短信验证码</span>
        </div>
        <div class="line line-btn">
            <input type="submit" class="btn" value="登录">
        </div>
    </form>
</div>
<div class="line line-reg clearfix">
    <p class="forget r"><a href="{if $ref}/home/account/register?backurl={$ref}{else}/home/account/register{/if}">立即注册</a></p>
</div>
<div class="line third-party">
    <h4> <span>第三方合作登录</span></h4>
</div>
<div class="line third-party-list">
    <a href="" class="uc-weibo-icon">微博</a>
    <a href="" class="uc-qq-icon">qq</a>
</div>
