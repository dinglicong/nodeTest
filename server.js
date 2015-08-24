var fs = require("fs");
var url = require("path");
var http = require("http");

function start(route,handle){
	function onRequest(request,response){
		//����API�ٷ���ȡurl������ʽ���˴�ʧЧ��ԭ����
		//var pathname = url.parse(request.url).path;
		//�˴�ֱ�ӻ�ȡlocalhost:8081/start�е�'/start'���֣�ԭ����
		
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
		 //��ȡ��ǰ�������
		  var data = toJson(decodeURI(postDataChunk));
		  console.log(data);
		  console.log("Received POST data chunk '"+ 
		  data + "'."); 
		  postData = data;
		  var returnData = {msg:"return success"};
		  console.log(response);
		  //�˴�У�鵱ǰ�����Ƿ��ظ��ύ
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