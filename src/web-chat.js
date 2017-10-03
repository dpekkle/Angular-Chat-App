//initialisation for our module and notification permissions

if (!("Notification" in window)) {
	alert("This browser does not support system notifications");
}
else{
	Notification.requestPermission().then((result) =>{
	  console.log(result);
	});
}

var app = angular.module("chatApp", ['btford.socket-io'])
	.factory('socket', function (socketFactory) {
		return socketFactory();
	})
	.value('userData', {username: '', myGravatar: '', userIsTyping: false});