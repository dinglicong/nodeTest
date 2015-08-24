var fs = require("fs");
var url = require("path");
var http = require("http");

function start(route,handle){
	function onRequest(request,response){
		//网络API官方获取url参数方式，此处失效，原因不明
		//var pathname = url.parse(request.url).path;
		//此处直接获取localhost:8081/start中的'/start'部分，原因不明
		
		var postData;
		var pathname = request.url;
		console.log(request.url);
		/*route(handle,pathname);
		
		response.writeHead(200,{"Content-Type":"text/html"});
		response.write("hello word");
		response.end();*/
		
		request.setEncoding("utf8"); 
		
		request.addListener("data", function(postDataChunk) { 
		 // postData += postDataChunk;
		 //获取当前请求参数
		  var data = toJson(decodeURI(postDataChunk));
		  console.log(data);
		  console.log("Received POST data chunk '"+ 
		  data + "'."); 
		  postData = data;
		  var returnData = {msg:"return success"};
		  console.log(response);
		  //此处校验当前数据是否重复提交
		})
		
		 request.addListener("end", function() { 
		  route(handle, pathname, response, postData); 
		}); 
		
	}
	
	http.createServer(onRequest).listen("8081");
	
}

function toJson(str){
	var  o = {};
	if(str.indexOf('&') != -1){
		var arr = str.split('&');
		
		for(var i= 0,al = arr.length;i<al;i++){
			if(arr[i].indexOf("=")!=-1){
				var param = arr[i].split("=");
				o[param[0]] = param[1];
			}
		}
	}else{
		o['hash'] = str;
	}
	return o;

}

function getData(){
	fs.readFile("data.json","utf-8",function(err,data){
		if(err) throw err;
		console.log(data);
		return data;
	});
}


exports.start = start;