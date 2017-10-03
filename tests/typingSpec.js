//test socket functions

function findIn(element, selector) {
	return angular.element(element[0].querySelector(selector));
}

String.prototype.normalizeSpace = function() {
	var string =  this.replace(/\s\s+/g, '');
	return string.replace(/\r?\n|\r/g, '');
}

describe('Typing Component', () => {
 
	let parentScope;
	let element;
 
	beforeEach(module('templates'));
	beforeEach(angular.mock.module('chatApp'));
 
	// 1:
	beforeEach(inject(($compile, $rootScope) => {

		// 2:
		parentScope = $rootScope.$new();
		parentScope.typing = ["tester"];

		// 3:
		element = angular.element(`<typing users="typing"></typing>`);
		$compile(element)(parentScope);

		// 4:
		parentScope.$digest();

	}));

		
	it('displays initial value of some attr', () => {

	// 5:
			const someAttrValue = findIn(element, '.test-typing').text().normalizeSpace();
			expect(someAttrValue).toEqual('tester');

	});
});