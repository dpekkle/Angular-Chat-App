function findIn(element, selector) {
	return angular.element(element[0].querySelector(selector));
}

String.prototype.normalizeSpace = function() {
	return this.replace(/\s\s+/g, '');
}

describe('Tabs Component', () => {
	let parentScope;
	let element;  
	let socket;

	beforeEach(module('templates'));
	beforeEach(angular.mock.module('chatApp'));
	beforeEach(module('btford.socket-io'));

	beforeEach(inject(($compile, $rootScope, _socket_) => {
		parentScope = $rootScope.$new();
		socket = _socket_;

		element = angular.element(`<online-users><online-users>`);
		$compile(element)(parentScope);

		parentScope.$digest();
	}));

	let users = [
		{ name: "chris", gravatar: "someimage", socket: "somesocket"},
		{ name: "toby", gravatar: "someimage", socket: "somesocket"}
	];

	it ('should display online users as they come online', ()=>{
		let username;
		socket.receive("respond online users", [users[0]]);
		socket.receive("user online", users[1]);
		username = findIn(element, '#testing-' + users[0].name).text().normalizeSpace();
		expect(username).toEqual(users[0].name);
		username = findIn(element, '#testing-' + users[1].name).text().normalizeSpace();
		expect(username).toEqual(users[1].name);
	});

	it ('should remove disconnecting users', ()=>{
		socket.receive("respond online users", [users[0]]);
		socket.receive("user logged out", users[0]);
		let username = findIn(element, '#testing-' + users[0].name).text();
		expect(username).not.toEqual(users[0].name);
	});
});