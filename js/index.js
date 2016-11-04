//根据浏览器大小初始化页面font-size 用rem来确定值的大小
(function  (doc,win) {
	var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		if(clientWidth>=640){
			docEl.style.fontSize = '100px';
		}else{
			docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
		}
	};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document,window);

/* 
	
*/