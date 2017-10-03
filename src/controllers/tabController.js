function tabController(userData, socket){
	//need to use some variable to pass 'this' to socket events
	var selfref = this;

	this.selectTab = (lobbyname) => {
		userData.userIsTyping = false;
		console.log("User changed tabs, typing: " + userData.userIsTyping);
		selfref.selected = lobbyname;
		scrollChat();
	}

	this.addtabs = (newTabName) => {
		console.log(selfref.tabs.findIndex(x => x.lobbyname==newTabName))
		if(selfref.tabs.findIndex(x => x.lobbyname==newTabName) == -1)
		{
			console.log("Add tab");
			var newtabs = this.tabs;
			newtabs.push({lobbyname: newTabName});
			this.tabs = newtabs;
			console.log(this.tabs);
			//using an event to notify about tab changing, may not be necessary in this case
			this.onTabsPush({$event: {tabs: newtabs}});
		}
	}

	this.removetab = (tabname) => {
		let index = this.tabs.findIndex(x => x.lobbyname==tabname);
		if(index !== -1)
		{
			this.tabs.splice(index, 1);
			this.onTabsPush({$event: {tabs: this.tabs}});
			if (this.selected == tabname)
				this.selectTab(this.tabs[index-1].lobbyname);
		}
	}

	socket.on("open private messenge tab", (data) => {
		console.log("incoming request, opening private messenger " + name);
		//check if that user as a window yet
		console.log(selfref.tabs);
		selfref.addtabs(data.name);
	})
}