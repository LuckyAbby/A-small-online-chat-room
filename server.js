var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server), //引入socket.io模块并绑定到服务器
    onlineUsers=[];
app.use('/', express.static(__dirname + '/www'));
server.listen(8083);
console.log("服务器开始启动");
io.on('connection',function(socket) {
	socket.on('login',function(inputName) {
		if (onlineUsers.indexOf(inputName) > -1) {
            socket.emit('userExisted');
        } else {
            socket.userIndex = onlineUsers.length;
            console.log("在数组中的序号是"+socket.userIndex);
            socket.inputName = inputName;
            onlineUsers.push(inputName);
            // console.log(onlineUsers.length);
            socket.emit('successLogin');
            // console.log("登陆！");
            console.log("第二步执行");
            console.log(onlineUsers);
            io.sockets.emit('system', inputName,onlineUsers.length,"online"); //向所有连接到服务器的客户端发送当前登陆用户的昵称 
        };
	});
	socket.on('disconnect',function() {
				console.log("第一步执行");
		console.log(socket.userIndex);
		onlineUsers.splice(onlineUsers.indexOf(socket.inputName), 1);
		console.log(socket.inputName);
		console.log(onlineUsers);
		socket.broadcast.emit('system',socket.inputName,onlineUsers.length,"outline");
	});
	socket.on('postMessage',function(msg,className) {
		socket.broadcast.emit('newMessage',msg,className)
	})
});