var fs = require("fs");

function start(res,postData){
	
	  var body = '<html>'+ 
    '<head>'+ 
    '<meta http-equiv="Content-Type" content="text/html; '+ 
    'charset=UTF-8" />'+ 
    '</head>'+ 
    '<body>'+ 
    '<form action="/upload" method="post">'+ 
    '<input name="department" type="text" placeholder="部门"/>'+ 
	'<input name="member" type="text" placeholder="名称"/>'+ 
    '<input type="submit" value="Submit text" />'+ 
    '</form>'+ 
    '</body>'+ 
    '</html>'; 
	
	res.writeHead(200, {"Content-Type": "text/html"}); 
    res.write(body); 
    res.end(); 
}

function upload(response, postData) { 
  console.log("Request handler 'upload' was called."); 
  response.writeHead(200, {"Content-Type": "text/plain"}); 
  response.write("You've sent: " + JSON.stringify(postData)); 
  response.end(); 
} 
 
exports.start = start; 
exports.upload = upload; 