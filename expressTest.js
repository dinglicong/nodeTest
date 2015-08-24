var express = require('express');
var app = express();
var fs = require("fs");
var http = require("http");
var url = require("url");
var bodyParser = require('body-parser');
var querystring = require("querystring");

var rOption = {
  flags : 'r',
  encoding : null,
  mode : 0666
}

//静态资源请求
app.use(express.static('src'));
app.use(bodyParser.urlencoded({extended:true}));

//获取所有部门，成员列表
app.get('/get', function(req, res){

	fs.readFile("data.json","utf-8",function(err,data){
		if(err) throw err;
		data = JSON.parse(data);
		
		res.send(200,data);
	});
	
});
//获取当前所有部门列表；
app.get("/getDepartmentList",function(req,res){
	var currentUrl = querystring.parse(url.parse(req.url).query);
	searchDepartment(currentUrl.department,res);
});
//打开提交列表
app.get('/postForm', function(req, res){

	var stream = fs.createReadStream('start.html',rOption);
	stream.pipe(res);
});
//提交新增部门，成员
app.post('/upload', function(req, res){
	var o = {};
		o.department = req.body.department;
		o.member = req.body.member;

	console.log(o);

	postData(o,addUser,res);
});
//订餐
app.post('/order', function(req, res){

	var o = {};
		o.department = req.body.department;
		o.member = req.body.member;

	console.log(o);

	orderData(o,addOrder,res);

});
//搜索部门列表
function searchDepartment(department,res){
	fs.readFile("data.json","utf-8",function(err,getdata){
		if(err) throw err;
		var data = JSON.parse(getdata);
		//console.log(JSON.stringify(data));
		var _arr = {};
		_arr.status = "OK";
		_arr.list = [];
		var _tl = data.list.length;
		for(var i=0;i<_tl;i++){
			if(data.list[i].department.match(department)){
				var _o = {};
				_o.department = data.list[i].department;
				_arr.list.push(_o);
			}
		}
		res.send(_arr);
	});
}

//
function userAdd(data){
	var stream = fs.createWriteStream('data.json','utf-8');
		stream.write(new Buffer(JSON.stringify(data)));
};
//遍历订单文件，如果已经下单，无法再下单
function orderAdd(postData,data,res){
	fs.readFile("order.json","utf-8",function(err,getdata){
		if(err) throw err;
		var data = JSON.parse(getdata);

		//res.send(returnData);
		var department = postData.department;
		var member = postData.member;
		var isMemberFound = false;
		var isdepartmentFound = false;
		for(var i=0,tl = data.list.length;i<tl;i++){
			if(data.list[i].department == department){
				isdepartmentFound = true;
				var ml = data.list[i].member.length;
				//遍历部门内member列表
				for(var j=0;j<ml;j++){
					if(data.list[i].member[j].name == member){
						isMemberFound = true;
					}
				}
				if(!isMemberFound){
					var _new = {};
					_new.name = member;
					data.list[i].member.push(_new);
				}
			}
		}
		//
		if(!isdepartmentFound){
			var _new = {};
			console.log(department)
			_new.department = department;
			_new.member = [];
			data.list.push(_new);
		}

		
		if(!isdepartmentFound||!isMemberFound){
			var stream = fs.createWriteStream('order.json','utf-8');
			stream.write(new Buffer(JSON.stringify(data)));
		}
		res.send(data);
	});
}

function verifyData(postData,data,callback){
	var department = postData.department;
	var member = postData.member;
	
	var isMemberFound = false;
	var isdepartmentFound = false;
	for(var i=0,tl = data.list.length;i<tl;i++){
		if(data.list[i].department == department){
			isdepartmentFound = true;
			var ml = data.list[i].member.length;
			//遍历部门内member列表
			for(var j=0;j<ml;j++){
				if(data.list[i].member[j].name == member){
					isMemberFound = true;
				}
			}
			//判断当前部门是否找到成员
			if(!isMemberFound){
				var _new = {};
				_new.name = member;
				_new.id = data.list[i].id + "_" + (data.list[i].member.length + 1);
				data.list[i].member.push(_new);
			}
		}
	}
	//判断是否找到部门
	if(!isdepartmentFound){
		var _new = {};
		console.log(department)
		_new.department = department;
		_new.id = "qian_" + (data.list.length +1 );
		_new.member = [];
		_new.member.push({name:member,id:_new.id+"_1"});
		//console.log(_new);
		data.list.push(_new);
	}

	//如果找到该部门，或者该成员
	if(!isdepartmentFound||!isMemberFound){
		callback(data);
	}
	console.log(data);
	return data;
}
//验证添加订单
function verifyOrderData(postData,data,callback,res){
	var department = postData.department;
	var member = postData.member;
	
	var isMemberFound = false;
	var isdepartmentFound = false;
	for(var i=0,tl = data.list.length;i<tl;i++){
		if(data.list[i].department == department){

			isdepartmentFound = true;
			var ml = data.list[i].member.length;

			//遍历部门内member列表
			for(var j=0;j<ml;j++){

				if(data.list[i].member[j].name == member){
					isMemberFound = true;
				}

			}
		}
	}
	if(isdepartmentFound&&isMemberFound){
		callback(postData,data,res);
	}

	return data;
}
//添加成员
function addUser(postData,data){
	var data = verifyData(postData,data,userAdd);
	return data;
}
//添加订餐
function addOrder(postData,data,res){

	var data = verifyOrderData(postData,data,orderAdd,res);
	return data;
}
//添加订单
function orderData(postData,callback,res){
	
	console.log("in orderData");
	fs.readFile("data.json","utf-8",function(err,getdata){
		if(err) throw err;
		var data = JSON.parse(getdata);
		callback(postData,data,res);
		//console.log(returnData);
		//res.send(returnData);
	});
}


app.listen(3000);
