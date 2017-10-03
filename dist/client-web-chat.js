"use strict";

//initialisation for our module and notification permissions

if (!("Notification" in window)) {
	alert("This browser does not support system notifications");
} else {
	Notification.requestPermission().then(function (result) {
		console.log(result);
	});
}

var app = angular.module("chatApp", ['btford.socket-io']).factory('socket', function (socketFactory) {
	return socketFactory();
}).value('userData', { username: '', myGravatar: '', userIsTyping: false });;function spawnNotification(body, icon, title) {
	if (!("Notification" in window)) return;else if (Notification.permission == 'denied') return;else {
		//small library to abstract browser window focus
		///if (!ifvisible.now('active'))
		//{
		console.log("sending notification: " + title + " : " + body);
		//alert("sending Notification");
		var note = new Notification(title, { body: body, icon: icon });
		//}	
	}
}

function cleanInput(input) {
	if (input == "" || input == null) return false;else if (input.len > 300) {
		return input.substr(0, 300);
	} else return input;
}

function scrollChat() {
	window.setTimeout(function () {
		var pane = document.getElementsByClassName('active-pane')[0];
		pane.scrollTop = pane.scrollHeight + 100;
	}, 100);
};app.controller('RootController', function (userData, socket) {
	//used to allow online users panel and tab panel to both share this.tabs attribute
	var selfref = this;
	this.tabs = [{ lobbyname: "Lobby" }];
	this.selectedTab = "Lobby";
	this.prompting = true;
});;function chatLogController(userData, socket) {
	var _this = this;

	var selfref = this;

	this.typing = new Map();

	this.messagesMap = new Map();

	this.$onInit = function () {
		console.log("selected: " + selfref.selected);
		_this.messagesMap.set(selfref.selected, []);
		_this.typing.set(selfref.selected, []);

		console.log("Make chat log history request");
		socket.emit("request chat history");

		socket.on("user typing", function (user, room) {
			if (!selfref.typing.has(room)) {
				selfref.typing.set(room, []);
			}

			console.log("user typing event");
			selfref.typing.get(room).push(user);
			scrollChat();
		});
		socket.on("get chat history", function (chatlog) {
			console.log("Received Chat History");
			selfref.messagesMap.set("Lobby", chatlog);
			scrollChat();
		});
		socket.on("update chat log", function (message) {
			//lobby
			selfref.receiveMessage(message);
		});
		socket.on("update private log", function (message, gravatar) {
			//private
			if (selfref.selected !== message.name) {
				spawnNotification(message.text, message.gravatar, "Message from " + message.name);
			}
			console.log("PM from " + message.name);
			//note that the room for the recipient is the senders name
			selfref.receiveMessage({ name: message.name, text: message.text, gravatar: gravatar, room: message.name });
		});
	};

	selfref.typingEvent = function () {
		if (!userData.userIsTyping) {
			userData.userIsTyping = true;
			socket.emit("typing", userData.username, selfref.selected);
			console.log("Typing event initiated");
		}
	};

	selfref.addMessage = function () {
		userData.userIsTyping = false;
		var input = cleanInput(selfref.input);
		if (input) {
			//create room in map if it doesn't already exist
			if (!selfref.messagesMap.has(selfref.selected)) {
				console.log("New room map created: " + selfref.selected);
				selfref.messagesMap.set(selfref.selected, []);
				selfref.typing.set(selfref.selected, []);
			}
			console.log("Emitting message");
			var message = { name: userData.username, text: input, gravatar: userData.myGravatar, room: selfref.selected };
			socket.emit("send", message);

			//Push the message to the array keyed for this lobby
			var chatlog = selfref.messagesMap.get(selfref.selected);
			chatlog.push(message);
			selfref.messagesMap.set(selfref.selected, chatlog);
			scrollChat();
		}
		selfref.input = "";
	};

	selfref.receiveMessage = function (message) {
		//remove typing indicator
		console.log("Received message:");
		console.log(message);
		if (!selfref.messagesMap.has(message.room)) {
			console.log("New room map created: " + message.room);
			selfref.messagesMap.set(message.room, []);
			selfref.typing.set(message.room, []);
		}

		var index = selfref.typing.get(message.room).indexOf(message.name);
		if (index != -1) {
			selfref.typing.get(message.room).splice(index, 1);
		}
		var chatlog = selfref.messagesMap.get(message.room);
		chatlog.push(message);
		selfref.messagesMap.set(message.room, chatlog);
		scrollChat();
	};
};;function onlineUsersController(userData, socket) {
	var _this2 = this;

	var selfref = this;
	this.onlineUsers = [];

	this.addtabs = function (newTabName) {
		console.log(selfref.tabs.findIndex(function (x) {
			return x.lobbyname == newTabName;
		}));
		if (selfref.tabs.findIndex(function (x) {
			return x.lobbyname == newTabName;
		}) == -1) {
			console.log("Add tab");
			var newtabs = _this2.tabs;
			newtabs.push({ lobbyname: newTabName });
			_this2.tabs = newtabs;
			//alternative method to using $scope.$apply, send out notification that binding changed
			_this2.onTabsPush({ $event: { tabs: newtabs } });
			userData.userIsTyping = false;
			selfref.selected = newTabName;
			//console.log("Selected is: " + newTabName)
		}
	};

	socket.emit("request online users", userData.username);

	socket.on("respond online users", function (user_array) {
		console.log("respond online users event");
		selfref.onlineUsers = user_array;
		console.log(user_array);
	});
	socket.on("user online", function (user) {
		selfref.onlineUsers.push(user);
		console.log(user.name + " came online");
		console.log(selfref.onlineUsers);
		spawnNotification(user.name + " came online", user.gravatar, "Online");
	});
	socket.on("user logged out", function (user) {
		console.log(user.name + " went offline");
		spawnNotification(user.name + " went offline", user.gravatar, "Offline");
		var index = selfref.onlineUsers.findIndex(function (x) {
			return x.name == user.name;
		});
		selfref.onlineUsers.splice(index, 1);
	});
};;function prompterController(userData, socket) {
	var _this3 = this;

	var selfref = this;
	selfref.error = false;

	setTimeout(function () {
		document.getElementById("prompt-input").focus();
	}, 10);

	this.newName = function () {
		socket.emit("request new name", _this3.nameInput);
		_this3.setName();
	};

	this.keepName = function () {
		socket.emit("don't change name");
		_this3.setName();
	};

	this.setName = function () {
		userData.username = _this3.nameInput;
	};

	socket.emit("request temp name", function (tempname) {
		console.log("request temp name");
		selfref.nameInput = tempname;
	});

	socket.on("deny username", function (error) {
		selfref.error = error;
	});

	socket.on("grant username", function (name, gravatar) {
		console.log("I just got my username " + name + " and gravatar: " + gravatar);
		selfref.error = false;
		userData.username = name;
		userData.myGravatar = gravatar;
		selfref.prompting = false;
	});
};function tabController(userData, socket) {
	var _this4 = this;

	//need to use some variable to pass 'this' to socket events
	var selfref = this;

	this.selectTab = function (lobbyname) {
		userData.userIsTyping = false;
		console.log("User changed tabs, typing: " + userData.userIsTyping);
		selfref.selected = lobbyname;
		scrollChat();
	};

	this.addtabs = function (newTabName) {
		console.log(selfref.tabs.findIndex(function (x) {
			return x.lobbyname == newTabName;
		}));
		if (selfref.tabs.findIndex(function (x) {
			return x.lobbyname == newTabName;
		}) == -1) {
			console.log("Add tab");
			var newtabs = _this4.tabs;
			newtabs.push({ lobbyname: newTabName });
			_this4.tabs = newtabs;
			console.log(_this4.tabs);
			//using an event to notify about tab changing, may not be necessary in this case
			_this4.onTabsPush({ $event: { tabs: newtabs } });
		}
	};

	this.removetab = function (tabname) {
		var index = _this4.tabs.findIndex(function (x) {
			return x.lobbyname == tabname;
		});
		if (index !== -1) {
			_this4.tabs.splice(index, 1);
			_this4.onTabsPush({ $event: { tabs: _this4.tabs } });
			if (_this4.selected == tabname) _this4.selectTab(_this4.tabs[index - 1].lobbyname);
		}
	};

	socket.on("open private messenge tab", function (data) {
		console.log("incoming request, opening private messenger " + name);
		//check if that user as a window yet
		console.log(selfref.tabs);
		selfref.addtabs(data.name);
	});
};var component_path = "src/components/";

app.component("prompter", {
	templateUrl: component_path + "prompter.html",
	controller: ['userData', 'socket', prompterController],
	bindings: {
		prompting: '='
	}
}).component("chatLog", {
	templateUrl: component_path + "chat-log.html",
	controller: ['userData', 'socket', chatLogController],
	bindings: {
		selected: '<'
	}
}).component("message", {
	templateUrl: component_path + "message.html",
	bindings: {
		data: '<',
		prevname: '<'
	}
}).component("typing", {
	templateUrl: component_path + "typing.html",
	bindings: {
		users: '<'
	}
}).component("tabs", {
	templateUrl: component_path + "tabs.html",
	controller: ['userData', 'socket', tabController],
	bindings: {
		tabs: '<',
		onTabsPush: '&',
		selected: '='
	}
}).component("onlineUsers", {
	templateUrl: component_path + "online-users.html",
	controller: ['userData', 'socket', onlineUsersController],
	bindings: {
		tabs: "<",
		onTabsPush: '&',
		selected: '='
	}
});
