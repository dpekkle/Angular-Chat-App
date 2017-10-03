// Some Auxillary Functions

function spawnNotification(body, icon, title)
{
	if (!("Notification" in window))
		return;
	else if(Notification.permission == 'denied')
		return;
	else {
		console.log("sending notification: " + title + " : " + body);
		var note = new Notification(title, {body: body, icon: icon});
	}
}

function cleanInput(input) {
	if (input == "" || input == null)
		return false;
	else if (input.len > 300){
		return input.substr(0,300);
	}
	else
		return input;
}

function scrollChat() {
	window.setTimeout(()=>{
		var pane = document.getElementsByClassName('active-pane')[0];
		pane.scrollTop = pane.scrollHeight + 100;	
	}, 100);
}