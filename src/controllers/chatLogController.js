 function chatLogController(userData, socket){
	var selfref = this;

	this.typing = new Map();

	this.messagesMap = new Map();

	this.$onInit = () => {
		console.log("selected: " + selfref.selected);
		this.messagesMap.set(selfref.selected, []);
		this.typing.set(selfref.selected, []);

		console.log("Make chat log history request");
		socket.emit("request chat history");

		socket.on("user typing", (user, room) => {
			if (!selfref.typing.has(room)){
				selfref.typing.set(room, []);
			}

			console.log("user typing event")
			selfref.typing.get(room).push(user);
			scrollChat();
		})
		socket.on("get chat history", (chatlog) => {
			console.log("Received Chat History");	
			selfref.messagesMap.set("Lobby", chatlog);
			scrollChat();
		});
		socket.on("update chat log", (message) => { //lobby
			selfref.receiveMessage(message); 
		})
		socket.on("update private log", (message, gravatar) => { //private
			if (selfref.selected !== message.name){
				spawnNotification(message.text, message.gravatar, "Message from " + message.name);
			}
			console.log("PM from " + message.name);
			//note that the room for the recipient is the senders name
			selfref.receiveMessage({name: message.name, text: message.text, gravatar: gravatar, room: message.name}); 		
		})	
	}

	selfref.typingEvent = () => {
		if (!userData.userIsTyping){
			userData.userIsTyping = true;
			socket.emit("typing", userData.username, selfref.selected);
			console.log("Typing event initiated");
		}		
	};

	selfref.addMessage = () => {
		userData.userIsTyping = false;
		var input = cleanInput(selfref.input);
		if (input)
		{
			//create room in map if it doesn't already exist
			if (!selfref.messagesMap.has(selfref.selected)){
				console.log("New room map created: " + selfref.selected)
				selfref.messagesMap.set(selfref.selected, []);
				selfref.typing.set(selfref.selected, []);
			}
			console.log("Emitting message")
			var message = {name: userData.username, text: input, gravatar: userData.myGravatar, room: selfref.selected};
			socket.emit("send", message);

			//Push the message to the array keyed for this lobby
			var chatlog = selfref.messagesMap.get(selfref.selected);
			chatlog.push(message);
			selfref.messagesMap.set(selfref.selected, chatlog);
			scrollChat();
		}
		selfref.input = "";
	};

	selfref.receiveMessage = (message) => {
		//remove typing indicator
		console.log("Received message:")
		console.log(message);
		if (!selfref.messagesMap.has(message.room)){
			console.log("New room map created: " + message.room)
			selfref.messagesMap.set(message.room, []);
			selfref.typing.set(message.room, []);
		}

		var index = selfref.typing.get(message.room).indexOf(message.name)
		if (index != -1){
			selfref.typing.get(message.room).splice(index, 1);
		}
		var chatlog = selfref.messagesMap.get(message.room);
		chatlog.push(message);
		selfref.messagesMap.set(message.room, chatlog);
		scrollChat();
	}
};