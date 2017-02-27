//封装获取id的函数
function $(id) {
	return document.getElementById(id);
}
function init()
{
	//建立到服务器的socket连接
	var socket=io.connect();
	//连接已经建立，监听connect事件
	socket.on('connect',function() {
		//连接成功
		$('promptMessage').innerHTML="请输入昵称";
		$('loginMessage').style.display="block";
		$('nameInput').focus();
	});
	//监听userExisted事件
	socket.on('userExisted',function() {
		$('promptMessage').innerHTML="该用户已经存在，请重新输入!";
	});
	//监听successLogin事件
	socket.on('successLogin',function() {
		console.log("登陆成功");
		console.log(length);
		// $('promptMessage').innerHTML="您已经成功登陆!";
		// $('loginMessage').style.display="none";
		$('loginContainer').style.display="none";
		$('messageInput').focus();
		// $('recordNum').innerHTML="当前在线人数为"+length;
	});
	socket.on('system',function(inputName,length,status) {

		var statusMessage=inputName+(status=="online"?"进入了聊天室":"退出了聊天室");
		var statusParagraph=document.createElement('p');
		statusParagraph.className="status";
		statusParagraph.innerHTML=statusMessage;
		console.log(statusParagraph);
		$('recordMessage').appendChild(statusParagraph);
		$('recordNum').innerHTML="当前在线人数为"+length;
		
	});
	//给输入昵称的按钮添加login事件
	$('nameBtn').addEventListener('click', function() {
            var inputName = $('nameInput').value;
            if (inputName.trim()) {
            	//如果昵称不为空的话就发送login事件
                socket.emit('login', inputName);
            } else {
                $('nameInput').focus();
            }
        }, false);
}
function sendMessage() {
	var socket=io.connect();
	$('sendBtn').addEventListener('click',function() {
		var message=$('messageInput');
		var messageValue=message.value.trim();
		if(messageValue.length===0) {
			message.focus();
			return false;
		}
		socket.emit('postMessage', messageValue,'other');
		showMessage(messageValue,'me');
		message.value="";
		message.focus();
	});
	socket.on('newMessage',function(messageValue,className) {
		showMessage(messageValue,className);
	})
}
function showMessage(messageValue,className) {
	var items=[];
	items.push('<dd class="'+(className === "me" ? "me" : "other")+'">');
	items.push('<ul>');
	items.push('<li>');
	items.push('<div class="head"></div>');
	items.push('<div class="name"></div>');
	items.push('<div class="text">'+messageValue+'</div>');
	items.push('</li>');
	items.push('</ul>');
	items.push('</dd>');
	$('recordMessage').innerHTML+=items.join('');
}
window.onload=function()
{
	init();
	sendMessage();
};