define(function(require,exports,module){
  var $ = require('jquery');
  ;(function($){
    $.fn.tc = function(options){
      var defaults = {
        dom:'.con',
        msg:'登陆成功',
        time:2000,
        onRender:''
      };
      var opts = $.extend(defaults, options);
      makeTc();
      function makeTc(){
        var html = [];
        html.push('<div class="tc-box" style="display: none"></div>');
        html.push('<div class="tc-con">');
        html.push('<div class="out-html">')
        html.push('<img />');
        html.push('<span class="pop-msg">'+opts.msg+'</span>');
        html.push('</div>')
        html.push('</div>');
        html = html.join('');
        $(opts.dom).append(html);
        if(typeof opts.onRender == 'function') {
          opts.onRender(opts.dom,html);
        }
        $('.tc-box,.tc-con').fadeIn();
        makeStyle();
        bindEvent();
        closeTc();
      }
      function makeStyle(){
        var con = $('.tc-con');
        var _w = con.width();
        var _h = con.height();
        con.css({
          'marginLeft':-_w/2+'px',
          'marginTop':-_h/2+'px'
        });
      }

      function bindEvent(){
        var _bg = $('.tc-box');
        //点击背景弹窗消失
        _bg.on("click",function(){
          if($(this).css('display') == 'block'){
            $('.tc-box,.tc-con').fadeOut();
          }else{
            $('.tc-box,.tc-con').fadeIn();
          }
        });
      }

      //过几秒自动消失
      var timer = null;
      function closeTc(){
        timer = setTimeout(function(){
          $('.tc-box,.tc-con').fadeOut();
        },opts.time);
        clearTimeout(timer);
      }
    }
  })(jQuery)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = $;
  }
});
