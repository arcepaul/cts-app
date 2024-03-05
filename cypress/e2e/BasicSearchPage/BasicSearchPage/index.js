/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

// Local field map as labels are not used in the shared field map.
const labelFieldMap = {
	Age: 'age',
	'Cancer Type/Keyword': 'type',
	'U.S. ZIP Code': 'zip',
	'Cancer Type/Condition': 'ct',
	'Keywords/Phrases': 'keywordPhrases',
};

const inputFieldMap = {
	Age: 'age',
	'Cancer Type/Keyword': 'ctk',
	'Primary Cancer Type/Condition': 'ct-searchTerm',
	'U.S. ZIP Code': 'zip',
	'Cancer Type/Condition': 'ct',
	'Keywords/Phrases': 'keywordPhrases',
};

And('the text {string} appears below the title', (introtext) => {
	cy.get('.search-page__header > p').should('contain', introtext);
});

And('Search tip icon is displayed and text {string} appears', (tiptext) => {
	cy.get('.cts-search-tip__icon').should('be.visible');
	cy.get('.cts-search-tip__body').should('contain', tiptext);
});

Then('help icon is displayed in {string} section with href {string}', (fieldLabel, helpHref) => {
	cy.get(`#fieldset--${labelFieldMap[fieldLabel]}`).find('a.text-icon-help').should('have.attr', 'href', helpHref);
});

And('autocomplete dropdown is displayed', () => {
	cy.get('.cts-autocomplete .menu-anchor :visible').should('exist');
});

And('user selects {string} from dropdown', (keyword) => {
	cy.get('.cts-autocomplete__menu-item').contains(keyword).click();
});

And('results info has text {string}', (resultsInfo) => {
	cy.get('.cts-results-header .all-trials').should('have.text', resultsInfo);
});

Then('{string} input field has a placeholder {string}', (fieldLabel, placeholderText) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).should('have.attr', 'placeholder', placeholderText);
});

When('user clicks on {string} field', (fieldLabel) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).click();
});

Then('{string} input field has a value {string}', (fieldLabel, value) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).should('have.value', value);
});

When('user types {string} in {string} field', (inputText, fieldLabel) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).type(inputText, { force: true });
});

And('trial info displays {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});

Then('alert {string} is displayed in {string} section', (alertText, fieldLabel) => {
	cy.get(`#fieldset--${labelFieldMap[fieldLabel]} .cts-input__error-message`).should('have.text', alertText);
});

Then('alert is not displayed in {string} section', (fieldLabel) => {
	cy.get('article').find(`#fieldset--${labelFieldMap[fieldLabel]} .cts-input__error-message`).should('not.exist');
});

Then('the search is not executed and path is {string}', (path) => {
	cy.location('pathname').should('equal', path);
});

When('user clears {string} input field', (fieldLabel) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).clear();
});

And('the criteria table displays the following', (dataTable) => {
	let index = 0;
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').eq(index).should('have.text', Category);
		cy.get('tbody tr td').eq(index).should('include.text', Selection);
		index++;
	}
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

When('user clicks on Start Over button', () => {
	cy.get('.all-trials a').contains('Start Over').click();
});

When('user types {string} in {string} field', (inputText, fieldLabel) => {
	cy.get(`input#${inputFieldMap[fieldLabel]}`).type(inputText);
});

Then('the title tag should be {string}', (expectedTitle) => {
	cy.get('head>title')
		.invoke('text')
		.then((title) => {
			expect(title.trim().replace(/\n/g), '').to.eq(expectedTitle);
		});
});
