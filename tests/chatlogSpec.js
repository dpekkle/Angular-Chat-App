function findCount(element, selector){
var i = element[0].querySelectorAll(selector).length;
return i;
}

function findIn(element, selector) {
return angular.element(element[0].querySelector(selector));
}

String.prototype.normalizeSpace = function() {
return this.replace(/\s\s+/g, '');
}

describe('Chat-Log Component', () => {

	let parentScope;
	let element;  
	let socket;
	let userData;

	beforeEach(module('templates'));
	beforeEach(angular.mock.module('chatApp'));
	beforeEach(module('btford.socket-io'));
	beforeEach(inject(($compile, $rootScope, _socket_) => {
		parentScope = $rootScope.$new();
		socket = _socket_;
		parentScope.selected = "Lobby";

		element = angular.element(`<chat-log selected="selected"></chat-log>`);
		$compile(element)(parentScope);

		parentScope.$digest();
	}));

	//test sample messages
	var messages = [
		{name: "Adam", text: "Hello there", gravatar: "somegrav", room: "Lobby"},
		{name: "Rowan", text: "Gday mate", gravatar: "somegrav", room: "Lobby"}
	];

	it ('should show what lobby we are in', ()=>{
		let logTitle;
		logTitle= findIn(element, '.testing-logname').text();
		expect(logTitle).toEqual("Lobby");

		//test changing lobby
		parentScope.selected = "Norman";
		parentScope.$digest();
		logTitle= findIn(element, '.testing-logname').text();
		expect(logTitle).toEqual("Norman");
	});
	
	it ('should load prior chat history', ()=>{
		socket.receive("get chat history", messages);
		let a_message = findCount(element, 'message');
		expect(a_message).toEqual(messages.length);
	});

	it ('should show messages received from other users', ()=>{
		socket.receive("update chat log", messages[0]);
		let a_message = findCount(element, 'message');
		expect(a_message).toEqual(1);
	});

	it ('should show private messages', ()=>{
		socket.receive("open private messenge tab", messages[0]);
		socket.receive("update private log", messages[0], messages[0].gravatar);

		//but not until we changes tabs
		let a_message = findCount(element, 'message');
		expect(a_message).toEqual(0);
		parentScope.selected = messages[0].name;
		parentScope.$digest();
		a_message = findCount(element, 'message');
		expect(a_message).toEqual(1);
	})
});
