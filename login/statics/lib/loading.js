define(function(require, exports, module) {

  	var $ = require('jquery');
  	var option = {
  		dom : '#load-container'
  	};
  function packHtml(){
    $('body').append('<div id="load-container"></div>');
  };
	$(function(){ //dom 加载完执行
		$(option.dom).show();
	})
	window.onload = function(){ // dom js 加载完执行
		setTimeout(function(){
			$(option.dom).hide();
		},1000);
	}
});
