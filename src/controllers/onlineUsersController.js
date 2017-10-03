function onlineUsersController(userData, socket){
	var selfref = this;
	this.onlineUsers = [];

	
	this.addtabs = (newTabName) => {
		console.log(selfref.tabs.findIndex(x => x.lobbyname==newTabName))
		if(selfref.tabs.findIndex(x => x.lobbyname==newTabName) == -1)
		{
			console.log("Add tab");
			var newtabs = this.tabs;
			newtabs.push({lobbyname: newTabName});
			this.tabs = newtabs;
			//alternative method to using $scope.$apply, send out notification that binding changed
			this.onTabsPush({$event: {tabs: newtabs}});
			userData.userIsTyping = false;
			selfref.selected = newTabName;
			//console.log("Selected is: " + newTabName)
		}
    }

    socket.emit("request online users", userData.username);

	socket.on("respond online users", (user_array) => {
		console.log("respond online users event")
		selfref.onlineUsers = user_array;
		console.log(user_array);
	});
	socket.on("user online", (user) => {
		selfref.onlineUsers.push(user);
		console.log(user.name + " came online")
		console.log(selfref.onlineUsers)
		spawnNotification(user.name + " came online", user.gravatar, "Online");
	});
	socket.on("user logged out", (user) => {
		console.log(user.name + " went offline");
		spawnNotification(user.name + " went offline", user.gravatar, "Offline");
		var index = selfref.onlineUsers.findIndex(x => x.name==user.name);
		selfref.onlineUsers.splice(index, 1);
	})
};