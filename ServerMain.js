/**
 * 
 */
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 3010;

//logging server status

server.listen(port,function(){
	console.log("listening to port "+port);
});


//Routing relatively its the path where server should find the other files for styling and js
app.use('/js',  express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public'));

//adding temp user server meta+info --need to add to sql/data store
var userList={};
var currentUserActive=0;

io.on('connection',function(socket){
	var userPresent=false;
	socket.on('newUser',function(userName){		
		//adding the user to the session still dont know the main purpose of this shit
		socket.userName=userName;
		userList[currentUserActive]=userName;
		currentUserActive=currentUserActive+1;
		socket.broadcast.emit('NewUserJoined',{
			userName: socket.userName,
			numUsers: currentUserActive
		});
		console.log('user joined '+userName);
	});
	
	
		socket.on('newOffer',function(){
			socket.broadcast.emit('newOffer','nothing');
			console.log('offerer Created');
		});
		
		socket.on('newAnswere',function(){			
			socket.broadcast.emit('newAnswere');
			console.log('answerer Created');
		});
	
	socket.on('disconnectUser',function(){
		if(userPresent){
			delete userList[socket.userName];
			currentUserActive=currentUserActive
			socket.broadcast.emit('userDisconnected', {
				userName: socket.userName,
				numUsers: currentUserActive
    		});
			console.log('user disconnected '+socket.userName);
		}
		
	});
	
});

