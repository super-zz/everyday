

var cookie = require('widget/util/cookie.js');

$(function(){
	setInterval(function(){
		if (cookie.get('reload') == 1) { 
			cookie.set('reload', 0);
	    window.location.reload(); 
	  } 
	}, 1000);
});
