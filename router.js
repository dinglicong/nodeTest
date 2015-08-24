var fs = require("fs");
var rOption = {
  flags : 'r',
  encoding : null,
  mode : 0666
}
function route(handle,pathname,response,postData){

	if(typeof handle[pathname] === "function"){
		handle[pathname](response,postData);
		//handle[pathname].apply(this,arguments);
		//fn.apply(this,arguments);
	}else{
		/*var stream = fs.createReadStream(pathname,rOption);
		stream.pipe(response);*/
	}
}

exports.route = route