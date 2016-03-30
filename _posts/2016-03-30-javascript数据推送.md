---
layout: detail
title: javascript数据推送
author: luo
picSrc: arc-data.jpg
type: 1
tags: [数据推送,Comet,Websocket,SSE]
describe: 数据推送在当下非常火热，我们的手机每天都能收到来自APP的各种消息，JavaScript数据推送主要致力于webapp的在线推送服务，不用我们每次都像服务器去发送Ajax请求而主动从Server端推送数据到本地。
---

### 1.Comet:基于http长链接的服务器推送技术 ###

Comet 是一种 Web 应用架构。服务器端会主动以异步的方式向客户端程序推送数据，而不需要客户端显式的发出请求。Comet 架构非常适合事件驱动的 Web 应用，以及对交互性和实时性要求很强的应用，如股票交易行情分析、聊天室和 Web 版在线游戏等。

#### 第一种方式： ####

> 服务端(data.php)

	<?php
	//header("Content-type:appliacation/json;charset=utf-8") ;
	header("CacheC-Control:max-age=0");
	$i = 0;
	while($ < 9){
		$i ++;
		//$res = array('success' => "ok",'text' => "我是测试文本");
		//echo json_encode($res);
		sleep(1);
		$randm = rand(1,999);
		echo $randm;
		echo "<br/>"
		ob_flush();
		flush();
	}
	?>

> 客户端（index.html）

	<script type="text/javascript" src="jquery.js"></script>

	<script type="text/javascript">

		var getXmlHttpRequest = function(){
			if (window.XMLHttpRequest){
				// code for all new browsers
				return new XMLHttpRequest();
			}
			else if (window.ActiveXObject)
			{
				// code for IE5 and IE6
				return new ActiveXObject("Microsoft.XMLHTTP");
			}
		};

		var xhr = getXmlHttpRequest();
		xhr.onreadystatechange = function(){
			console.log(xhr.readyState);
			if(xhr.readyState = 3 && xhr.status = 200){
				//获取成功后执行操作
				//数据在xhr.responseText;
				console.log(xhr.responseText)
			}
		}
		xhr.open("get","data.php",true);
		xhr.send("");
	</script>

#### 第二种方式： ####

> 服务端(data.php)

	<?php
	header("Content-type:appliacation/json;charset=utf-8") ;
	header("CacheC-Control:max-age=0");

	sleep(1);
	while(true) {
		$res = array('success' => "ok",'text' => "我是测试文本");
		echo json_encode($res);	
		exit();
	}

	?>

> 客户端（index.html）

	<script type="text/javascript" src="jquery.js"></script>

	<script type="text/javascript">
		function comet() {
			$.ajax({
				url:'data.php',
				dataType:'json',
				success:function (data) {
					console.log(data);
					comet();
				}
			})
		}
		comet();
	</script>

### 2.基于Websocket的推送方案 ###

基于WebSocket 的推送方案，在浏览器中通过http仅能实现单向的通信,comet可以一定程度上模拟双向通信,但效率较低,并需要服务器有较好的支持; flash中的socket和xmlsocket可以实现真正的双向通信,通过 flex ajax bridge,可以在javascript中使用这两项功能. 可以预见,如果websocket一旦在浏览器中得到实现,将会替代上面两项技术,得到广泛的使用.面对这种状况，HTML5定义了WebSocket协议，能更好的节省服务器资源和带宽并达到实时通讯。

### 3.SSE（Server－Send Event）:服务器推送数据新方式 ###

服务器推送数据的新方式SSE，传统的网页都是浏览器向服务器"查询"数据，但是很多场合，最有效的方式是服务器向浏览器"发送"数据。比如，每当收到新的电子邮件,服务器就向浏览器发送一个"通知",这要比浏览器按时向服务器查询（polling）更有效率。服务器发送事件（Server-Sent Events，简称SSE）就是为了解决这个问题，而提出的一种新API，部署在EventSource对象上。目前，除了IE，其他主流浏览器都支持。

> data.php

	<php
		header("Content-Type:text/event-stream;charset=utf-8");
		header("Access-Control-Allow-Origin:http://127.0.0.1/");
		echo "data:现在北京时间是".data('H:i:s')."\r\n";
	?>

> index.js 

	var source;

	function init(){
		source = new EventSource('http:/locahost/sse/data.php');
		source.onopen = function(){
			console.log("连接已建立",this.readyState);
		}
		source.onmessage = function(event){
			console.log("从服务器获取的数据",event.data)
		}	
		source.onerror = function(){
			
		}
	}
	init();


> index.html

	<mate charset="utf-8"/>
	<script type="text/javascript" src="index.js"></script>