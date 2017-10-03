let component_path = "src/components/";

app.component("prompter", {
		templateUrl: component_path + "prompter.html",
		controller: ['userData', 'socket', prompterController],
		bindings: {
			prompting: '=',
		}
	})
	.component("chatLog", {
		templateUrl: component_path + "chat-log.html",
		controller: ['userData', 'socket', chatLogController],
		bindings:{
			selected: '<',
		},
	})
	.component("message", {
		templateUrl: component_path + "message.html",
		bindings: {
			data: '<',
			prevname: '<'
		}
	})
	.component("typing", {
		templateUrl: component_path + "typing.html",
		bindings: {
			users: '<'
		}
	})
	.component("tabs", {
		templateUrl: component_path	+ "tabs.html",
		controller: ['userData', 'socket', tabController],
		bindings:{
			tabs: '<',
			onTabsPush: '&',
			selected: '='
		},
	})
	.component("onlineUsers", {
		templateUrl: component_path + "online-users.html",
		controller: ['userData', 'socket', onlineUsersController],
		bindings:{
			tabs: "<",
			onTabsPush: '&',
			selected: '=',
		}
	})

