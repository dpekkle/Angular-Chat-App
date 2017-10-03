app.controller('RootController', (userData, socket) function() {
	//used to allow online users panel and tab panel to both share this.tabs attribute
	this.tabs = [{lobbyname: "Lobby"}];
	this.selectedTab = "Lobby";
	this.prompting = true;
});