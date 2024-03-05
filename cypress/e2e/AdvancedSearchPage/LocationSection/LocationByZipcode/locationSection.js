/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

const fieldMap = {
	'Limit results to Veterans Affairs facilities': 'search-location-toggle',
	'U.S. ZIP Code': 'zip',
	State: 'lst',
	City: 'city',
	'Hospitals/Institutions': 'hospitals / institutions',
};

const radioButtons = {
	'Search All Locations': 'search-location-all',
	'ZIP Code': 'search-location-zip',
	'Country, State, City': 'search-location-country',
	'Hospitals/Institutions': 'search-location-hospital',
	'At NIH (only show trials at the NIH Clinical Center in Bethesda, MD)': 'search-location-nih',
};

const dropDown = {
	Radius: 'zipRadius',
	Country: 'country',
};

And('trial info displays {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});

And('the criteria table displays the following', (dataTable) => {
	cy.get('tbody > tr').should('have.length', dataTable.hashes().length);
	//index assures correct order
	let index = 0;
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').eq(index).should('have.text', Category);
		cy.get('tbody tr td').eq(index).should('have.text', Selection);
		index++;
	}
});

And('info text {string} is displayed in the section body', (infoText) => {
	cy.get('#fieldset--location').find('p').should('have.text', infoText);
});

And('trial info displayes {string}', (infoText) => {
	cy.get('.all-trials').should('include.text', infoText);
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

And('user selects {string} radio button', (label) => {
	cy.get(`input#${radioButtons[label]}`).click({ force: true });
});

And('user selects {string} from dropdown', (keyword) => {
	cy.get('.cts-autocomplete__menu-item').contains(keyword).click();
});

And('user types {string} in {string} autosuggest field', (text, fieldLabel) => {
	cy.get(`input[aria-label="${fieldMap[fieldLabel]}"]`).type(text);
});

And('user types {string} in {string} field', (text, fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).type(text);
});

And('{string} no trial info is displayed', (noTrialsText) => {
	cy.get('.no-results').should('have.text', noTrialsText);
});

And('{string} text is displayed as results header', (resHeader) => {
	cy.get('div[class="results-list no-results"]').should('include.text', resHeader);
});

And('the invalid criteria table displays the following', (dataTable) => {
	cy.get('ul > li').should('have.length', dataTable.rows().length);
	for (const { Criteria } of dataTable.hashes()) {
		cy.get('ul > li').contains(`${Criteria}`).should('exist');
	}
});

And('help icon is displayed in {string} section with href {string}', (section, href) => {
	cy.get(`#fieldset--${section.replace(' ', '').toLowerCase()}`)
		.find('a')
		.should('have.attr', 'href', href);
});

And('{string} toggle is displayed with label {string}', (fieldLabel, text) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).siblings().get('.cts-toggle__label').should('have.attr', 'aria-label', text);
});

And('{string} toggle is switched to {string}', (fieldLabel, value) => {
	const checked = value.toLowerCase() === 'yes' ? true : false;
	if (checked) {
		cy.get(`input#${fieldMap[fieldLabel]}`).should('be.checked');
	} else {
		cy.get(`input#${fieldMap[fieldLabel]}`).should('not.be.checked');
	}
});

When('user toggles {string}', (fieldLabel) => {
	cy.get(`label[for="${fieldMap[fieldLabel]}"]`).click({ force: true });
});

And('{string} radio button is checked', (lbl) => {
	cy.get(`input#${radioButtons[lbl]}`).should('be.checked');
});

And('the following radio buttons are displayed', (dataTable) => {
	cy.get('#fieldset--location').find('div.cts-radio label').should('have.length', dataTable.hashes().length);
	for (const { label } of dataTable.hashes()) {
		cy.get('#fieldset--location').find(`div.cts-radio label[for="${radioButtons[label]}"]`).should('have.text', label);
	}
});

And('user selects {string} from {string} dropdown', (selection, dropdown) => {
	cy.get(`#${dropDown[dropdown]}`).select(selection);
});

Then('{string} dropdown has a value {string}', (dropdown, value) => {
	cy.get(`select#${dropDown[dropdown]} option:selected`).should('have.value', value);
});

Then('{string} input field has a value {string}', (fieldLabel, value) => {
	if (fieldLabel.toLowerCase().includes('hospitals')) {
		cy.get(`input[aria-label="${fieldMap[fieldLabel]}"]`).should('have.value', value);
	} else {
		cy.get(`input#${fieldMap[fieldLabel]}`).should('have.value', value);
	}
});

Then('alert {string} is displayed', (alertText) => {
	cy.get('.cts-input__error-message').should('have.text', alertText);
});

Then('the search is not executed and path is {string}', (path) => {
	cy.location('pathname').should('equal', path);
});

Then('{string} input field is not displayed', (label) => {
	cy.get(`input#${fieldMap[label]}`).should('not.exist');
});

When('user removes {string} from the {string} field', (selectedType, fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).parent('.cts-chip-list').as('fieldInFocus');
	cy.get('@fieldInFocus').find(`button[value="${selectedType}"]`).click();
});

When('user clears {string} input field', (fieldLabel) => {
	if (fieldLabel.includes('Hospitals')) {
		cy.get(`input[aria-label="${fieldMap[fieldLabel]}"]`).clear();
	} else {
		cy.get(`input#${fieldMap[fieldLabel]}`).clear();
	}
});

And('the url query has the following corresponding code with duplicated keys', (dataTable) => {
	cy.location('href').then((url) => {
		const params = new URL(url).searchParams;
		//verify num of url params matches expected
		expect(Array.from(params.entries()).length).to.eq(dataTable.raw().length);
		//verify that url query params have expected values
		expect(Array.from(params.entries())).to.deep.equal(dataTable.raw());
	});
});

And('the {int} result item has a {string} info with {string}', (itemIndex, infoCategory, infoText) => {
	cy.get('.results-list-item.results-list__item')
		.eq(itemIndex - 1)
		.find('.results-list-item__category')
		.eq(3)
		.should('have.text', `${infoCategory}${infoText}`);
});

And('the matched location {string} is {string}', (category, name) => {
	if (category.toLowerCase() === 'country') {
		cy.get('.sites-nearby h3').should('have.text', name);
	} else if (category.toLowerCase() === 'state') {
		cy.get('.sites-nearby .location-state h4').should('have.text', name);
	} else if (category.toLowerCase() === 'city') {
		cy.get('.sites-nearby .location-city h5').should('have.text', name);
	}
});

When('user clicks on {int} trial link', (resItemIndex) => {
	cy.get('.results-list-item__title a')
		.eq(resItemIndex - 1)
		.click();
});

When('user clicks on {string} section of accordion', (section) => {
	cy.get('div[class="cts-accordion  "] button.cts-accordion__button').contains(section).click();
});

And('text {string} is displayed', (text) => {
	cy.get('p').contains(text).should('be.visible');
});

And('search criteria table is not displayed', () => {
	cy.get('div.cts-accordion.table-dropdown').should('not.exist');
});

And('{string} has a link {string}', (link, href) => {
	cy.get('form').should('have.attr', 'action', href);
	cy.get('form button').should('have.text', link);
});
