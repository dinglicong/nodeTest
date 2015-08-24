var fs = require("fs");
var http = require("http");
var rOption = {
  flags : 'r',
  encoding : null,
  mode : 0666
}


//将文件读入内存方式，对内存开销较大
/*fs.readFile('data.js','utf-8',function(err,data){
	if(err){
		console.log(err);
	}else{
		console.log(JSON.parse(data).list);
	}
})
*/

//流方式
var server = http.createServer(function(req,res){
	var stream = fs.createReadStream('data.js',rOption);
	stream.pipe(res);
	//console.log(stream.content)
}).listen("8081");

