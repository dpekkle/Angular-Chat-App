//should test socket.io event (creating a tab on message receive)

function findIn(element, selector) {
	return angular.element(element[0].querySelector(selector));
}

String.prototype.normalizeSpace = function() {
	return this.replace(/\s\s+/g, '');
}

describe('Tabs Component', () => {

	let parentScope;
	let element;  

	beforeEach(module('templates'));
	beforeEach(angular.mock.module('chatApp'));

	// 1:
	beforeEach(inject(($compile, $rootScope) => {
		// 2:
		parentScope = $rootScope.$new();
		parentScope.selected = "Lobby";
		parentScope.tabs = [{lobbyname: "Lobby"}];

		// 3:
		element = angular.element(`<tabs selected="selected" tabs="tabs" on-tabs-push="root.tabs = $event.tabs"></tabs>`);
		$compile(element)(parentScope);

		// 4:
		parentScope.$digest();
	}));

	it('displays initial value of some attr', () => {
	// 5:
		const someAttrValue = findIn(element, '.tab').text().normalizeSpace();
		expect(someAttrValue).toEqual("Lobby");
		const selected = findIn(element, '.tab').hasClass('selected-tab');
		expect(selected).toBe(true);
	});

	it('can toggle selection', () => {
		parentScope.selected = "SomeOtherTab";
		parentScope.$digest();
		const selected = findIn(element, '.tab').hasClass('selected-tab');
		expect(selected).toBe(false);
	});
});