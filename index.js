var server = require("./server");
var router = require("./router");
var fs = require("fs");
var requestHandlers = require("./requestHandlers");
var rOption = {
  flags : 'r',
  encoding : null,
  mode : 0666
}

var handle = {};
handle["/"] = function(){console.log("start in route")};
handle["/start"] = function(response){
	var stream = fs.createReadStream('start.html',rOption);
	stream.pipe(response);
};
handle["/js/jquery.js"] = function(response){
	var stream = fs.createReadStream('./js/jquery.js',rOption);
	stream.pipe(response);
};
handle["/getlist"] = function(response){
	var stream = fs.createReadStream('data.js',rOption);
	stream.pipe(response);
};
handle["/upload"] = requestHandlers.upload;



server.start(router.route,handle);