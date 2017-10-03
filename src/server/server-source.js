var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//use server root as directory path for file requests
app.use(express.static(__dirname));

http.listen(3000, () => {
	console.log('listening on *:3000');
});


var useriterator = 0;
//map to store users
var userlist = [];
//lobby chat history
var chatlog = [];

//socket.io event handling
io.on('connection', (socket) => {

	let userid = "user" + useriterator++;
	socket.on("request temp name", (callback) => {
		//immediately pass back generated userid
		callback(userid);
	});

	//allow user to change userid
	socket.on("request new name", (username) => {
		if (username.length < 2 || username.length > 50 ){
			console.log("Deny username")
			socket.emit('deny username', "Username must be between 2 and 50 characters");
		}
		else if (userlist.findIndex(x => x.name==username) !== -1){
			console.log("Deny username")
			socket.emit('deny username', "Username already exists");
		}
		else{
			//create user
			var user = {
				name: username,
				gravatar: loadGravatar(username),
				socket: socket.id
			};			
			userid = user.name;
			console.log("Granting: " + user.name  + " for " + userid);
			socket.emit('grant username', user.name, user.gravatar);
			//add the user and broadcast
			socket.broadcast.emit('user online', user);
			userlist.push(user);
		}
	})

	//grant a short history of the lobby's chat
	socket.on("request chat history", () => {
		console.log("Sending chat history");
		socket.emit('get chat history', chatlog);
	});

	socket.on("request online users", (requester) => {
		//Don't want to display the requester to themselves, so we remove it server side
		let userlist_sans_request = userlist.slice();

		let index = userlist_sans_request.map(x => x.name).indexOf(requester);
		if (index != -1){
			console.log("Remove: " + userlist_sans_request[index].name);
			userlist_sans_request.splice(index, 1);
		}
		socket.emit("respond online users", userlist_sans_request);
	});

	//listen for indicator that a user is typing, as well as where they are doing so
	socket.on("typing", (user, target) => {
		if(target == "Lobby"){
			console.log(user + " typing");
			socket.broadcast.emit("user typing", user, "Lobby");
		}
		else{
			//send only to PM partner
			console.log(user + " typing");
			socket.to(usernameToSocket(target)).emit("user typing", user, user);
		}
	})

	//someone wants to send a message, so we figure out who to send it to
	socket.on("send", (message) => {
		message.gravatar = getGravatar(message.name);
		if(message.room == "Lobby"){
			console.log("Message received - " + message.name + ": " + message.text);
			chatlog.push(message);
			if (chatlog.length > 25) //arbitrary maximum size for history
				chatlog.shift(); 
			socket.broadcast.emit("update chat log", message)
		}
		else{
			console.log("Private message from " + message.name + " to " + usernameToSocket(message.room));
			socket.to(usernameToSocket(message.room)).emit("open private messenge tab", message);
			socket.to(usernameToSocket(message.room)).emit("update private log", message, message.gravatar);
		}
	});

	socket.on('disconnect', () => {
		//remove them from userlist
		var index = userlist.findIndex(x => x.name==userid);
		if (index != -1){
			var user = userlist[index];
			console.log(user.name + ' disconnected');
			socket.broadcast.emit("user logged out", user);
			userlist.splice(index, 1)
		}
	});
});