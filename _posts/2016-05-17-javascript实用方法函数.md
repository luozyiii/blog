---
layout: detail
title: javascript实用方法函数
author: luo
picSrc: arc-function.jpg
type: 1
tags: [javascript,方法,函数]
describe: 最常用的javascript方法函数
---

####字符串长度截取####

	function cutstr(str, len) {
       	var temp,
           	icount = 0,
           	patrn = /[^\x00-\xff]/，
           	strre = "";
       	for (var i = 0; i < str.length; i++) {
           	if (icount < len - 1) {
               	temp = str.substr(i, 1);
                   	if (patrn.exec(temp) == null) {
                      	icount = icount + 1
               	} else {
                   	icount = icount + 2
               	}
               	strre += temp
               	} else {
               	break;
           	}
       	}
       	return strre + "..."
   }

####替换全部####

	String.prototype.replaceAll = function(s1, s2) {
	   	return this.replace(new RegExp(s1, "gm"), s2)
	}

####清除空格####

	String.prototype.trim = function() {
	   	var reExtraSpace = /^\s*(.*?)\s+$/;
	   	return this.replace(reExtraSpace, "$1")
	}

####清除左空格/右空格####

	function ltrim(s){ return s.replace( /^(\s*|　*)/, ""); } 
	function rtrim(s){ return s.replace( /(\s*|　*)$/, ""); }

####判断是否以某个字符串开头####

	String.prototype.startWith = function (s) {
	   	return this.indexOf(s) == 0
	}

####判断是否以某个字符串结束####

	String.prototype.endWith = function (s) {
	   	var d = this.length - s.length;
	   	return (d >= 0 && this.lastIndexOf(s) == d)
	}

####转义html标签####

	function HtmlEncode(text) {
	   	return text.replace(/&/g, '&').replace(/\"/g, '"').replace(/</g, '<').replace(/>/g, '>')
	}

####时间日期格式转换####

	Date.prototype.Format = function(formatStr) {
		var str = formatStr;
		var Week = ['日', '一', '二', '三', '四', '五', '六'];
		str = str.replace(/yyyy|YYYY/, this.getFullYear());
		str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
		str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
		str = str.replace(/M/g, (this.getMonth() + 1));
		str = str.replace(/w|W/g, Week[this.getDay()]);
		str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
		str = str.replace(/d|D/g, this.getDate());
		str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
		str = str.replace(/h|H/g, this.getHours());
		str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
		str = str.replace(/m/g, this.getMinutes());
		str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
		str = str.replace(/s|S/g, this.getSeconds());
		return str
	}

####判断是否为数字类型####

	function isDigit(value) {
       	var patrn = /^[0-9]*$/;
       	if (patrn.exec(value) == null || value == "") {
           	return false
       	} else {
           	return true
       	}
   	}

####设置cookie值####
	function setCookie(name, value, Hours) {
		var d = new Date();
		var offset = 8;
		var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
		var nd = utc + (3600000 * offset);
		var exp = new Date(nd);
		exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString() + ";domain=360doc.com;"
	}

####获取cookie值####

	function getCookie(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if (arr != null) return unescape(arr[2]);
		return null
	}

####加入收藏夹####

	function AddFavorite(sURL, sTitle) {
	   	try {
	       	window.external.addFavorite(sURL, sTitle)
	   	} catch(e) {
	       	try {
	           	window.sidebar.addPanel(sTitle, sURL, "")
	       	} catch(e) {
	           	alert("加入收藏失败，请使用Ctrl+D进行添加")
	       	}
	   	}
	}

####设为首页####

	function setHomepage() {
       	if (document.all) {
           	document.body.style.behavior = 'url(#default#homepage)';
           	document.body.setHomePage('http://w3cboy.com')
       	} else if (window.sidebar) {
           	if (window.netscape) {
               	try {
                   	netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
               	} catch(e) {
                  	alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true")
                   	}
           	}
          	var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
           	prefs.setCharPref('browser.startup.homepage', 'http://w3cboy.com')
       }
   }

####加载样式文件####

	function LoadStyle(url) {
       	try {
           	document.createStyleSheet(url)
       	} catch(e) {
			var cssLink = document.createElement('link');
			cssLink.rel = 'stylesheet';
			cssLink.type = 'text/css';
			cssLink.href = url;
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(cssLink)
       	}
   	}

####返回脚本内容####

	function evalscript(s) {
       	if(s.indexOf('<script') == -1) return s;
       	var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
       	var arr = [];
       	while(arr = p.exec(s)) {
          	var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i;
           	var arr1 = [];
           	arr1 = p1.exec(arr[0]);
           	if(arr1) {
               	appendscript(arr1[1], '', arr1[2], arr1[3]);
           	} else {
               	p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
               	arr1 = p1.exec(arr[0]);
               	appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1);
           	}
       	}
       	return s;
   	}

####清除脚本内容####

	function stripscript(s) {
       	return s.replace(/<script.*?>.*?<\/script>/ig, '');
   	}

####动态加载脚本文件####

	function appendscript(src, text, reload, charset) {
		var id = hash(src + text);
		if(!reload && in_array(id, evalscripts)) return;
		if(reload && $(id)) {
		   	$(id).parentNode.removeChild($(id));
		}

		evalscripts.push(id);
		var scriptNode = document.createElement("script");
		scriptNode.type = "text/javascript";
		scriptNode.id = id;
		scriptNode.charset = charset ? charset : (BROWSER.firefox ? document.characterSet : document.charset);
		try {
		   	if(src) {
		       	scriptNode.src = src;
		       	scriptNode.onloadDone = false;
		       	scriptNode.onload = function () {
		           	scriptNode.onloadDone = true;
		           	JSLOADED[src] = 1;
		        };
		        scriptNode.onreadystatechange = function () {
		            if((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
		               scriptNode.onloadDone = true;
		               JSLOADED[src] = 1;
		           	}
		        };
		   	} else if(text){
		       	scriptNode.text = text;
		   	}
		   	document.getElementsByTagName('head')[0].appendChild(scriptNode);
		} catch(e) {}
	}

####返回按ID检索的元素对象####

	function $(id) {
		return !id ? null : document.getElementById(id);
	}

####跨浏览器绑定事件####

	function addEventSamp(obj,evt,fn){ 
		if(!oTarget){return;}
		if (obj.addEventListener) { 
		   	obj.addEventListener(evt, fn, false); 
		}else if(obj.attachEvent){ 
		   	obj.attachEvent('on'+evt,fn); 
		}else{
		   	oTarget["on" + sEvtType] = fn;
		} 
   	}

####跨浏览器删除事件####

	function delEvt(obj,evt,fn){
       	if(!obj){return;}
       	if(obj.addEventListener){
           	obj.addEventListener(evt,fn,false);
       	}else if(oTarget.attachEvent){
           	obj.attachEvent("on" + evt,fn);
       	}else{
           	obj["on" + evt] = fn;
       	}
   	}











