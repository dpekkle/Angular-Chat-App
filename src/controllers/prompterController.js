function prompterController(userData, socket){
	let selfref = this;
	selfref.error = false;

	setTimeout(() => {
		document.getElementById("prompt-input").focus();
	}, 10);

	this.newName = () => {
		socket.emit("request new name", this.nameInput)
		userData.username = this.nameInput;
	};

	socket.emit("request temp name", (tempname) => {
		// console.log("request temp name");
		selfref.nameInput = tempname;
	});

	socket.on("deny username", (error) => {
		selfref.error = error;
	});

	socket.on("grant username", (name, gravatar) => {
		console.log("I just got my username " + name + " and gravatar: " + gravatar);
		selfref.error = false;
		userData.username = name;
		userData.myGravatar = gravatar;
		selfref.prompting = false;
	});

}