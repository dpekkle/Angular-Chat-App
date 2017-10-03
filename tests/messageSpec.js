//Adapted from testing guide at https://velesin.io/2016/08/23/unit-testing-angular-1-5-components/

function findIn(element, selector) {
	return angular.element(element[0].querySelector(selector));
}

String.prototype.normalizeSpace = function() {
	return this.replace(/\s\s+/g, '');
}

describe('Message Component', () => {
	let parentScope;
	let element;  

	beforeEach(module('templates'));
	beforeEach(angular.mock.module("chatApp"));
	beforeEach(inject(($compile, $rootScope) => {
		parentScope = $rootScope.$new();
		parentScope.data = {name: "bob", text: "howdy", gravatar: "none"};

		element = angular.element(`<message data="data"></message>`);
		$compile(element)(parentScope);

		parentScope.$digest();
	}));

	it('displays initial value of some attr', () => {
		const messageName = findIn(element, '.user-name').text().normalizeSpace();
		expect(messageName).toEqual('bob');
	});
	
	it('displays changed value of some attr', () => {
		parentScope.data = {name: "chris", gravatar: "none"};
		parentScope.$digest();
		const messageName = findIn(element, '.user-name').text().normalizeSpace();
		expect(messageName).toEqual('chris');
	});
});
