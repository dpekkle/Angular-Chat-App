var md5 = require('md5');

function loadGravatar(username)
{
	//default icon
	console.log("Testing: " + username)
	var gravatar = "https://pbs.twimg.com/profile_images/831993825635745796/HnVmB0-k.jpg";
	var email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	console.log("In loadGravatar");
	if (email_regex.test(username))
	{
		console.log("Passed Regex Test;")
		//md5 hash email address
		var hash = md5(username);
		//retrieve gravatar, which is just the url + hash + size parameter
		gravatar = "https://www.gravatar.com/avatar/" + hash + "?s=64";
		console.log("Gravatar URL: " + gravatar);
		return gravatar;
	}
	else{
		console.log("Failed regex test");
		return gravatar;
	}
}

function getGravatar(username)
{
	let index = userlist.map(x => x.name).indexOf(username);
	if ( index != -1)
		return userlist[index].gravatar;

}

function usernameToSocket(username){
	let index = userlist.map(x => x.name).indexOf(username);
	if ( index != -1)
		return userlist[index].socket;
}

function socketToUsername(){
	let index = userlist.map(x => x.socket).indexOf(socket.id);
	if ( index != -1)
		return userlist[index].name;
}

function userConnected(userid, socket){
	console.log("user confirmed: " + userid)
	return user;
}