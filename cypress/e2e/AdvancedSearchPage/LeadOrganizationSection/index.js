/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

And('user selects {string} from dropdown', (autosuggestTerm) => {
	cy.get('div.cts-autocomplete__menu.--leadOrg').should('be.visible');
	cy.get('div.cts-autocomplete__menu.--leadOrg div.highlighted:visible').should('have.text', autosuggestTerm).click();
});

Then('autocomplete dropdown is displayed', () => {
	cy.get('div.cts-autocomplete__menu-item:visible').should('be.visible');
});

Then('autocomplete dropdown is displayed with {string} text', (autosuggestItem) => {
	cy.get('div.cts-autocomplete__menu-item:visible').should('have.text', autosuggestItem);
});

And('help icon is displayed in {string} section with href {string}', (fieldLabel, href) => {
	cy.get(`a[href="${href}"]`).parent().find('span').should('have.text', fieldLabel);
});

Then('{string} input field has a placeholder {string}', (fieldLabel, placeholderText) => {
	cy.get(`input[aria-label="${fieldLabel}"]`).should('have.attr', 'placeholder', placeholderText);
});

When('user clicks on {string} field', (fieldLabel) => {
	cy.get(`input[aria-label="${fieldLabel}"]`).click();
});

When('user types {string} in {string} field', (inputText, fieldLabel) => {
	cy.get(`input[aria-label="${fieldLabel}"]`).type(inputText);
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
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

And('trial info displayes {string}', (infoText) => {
	cy.get('.all-trials').should('include.text', infoText);
});

Then('{string} field has value {string}', (fieldLabel, value) => {
	cy.get(`input[aria-label="${fieldLabel}"]`).should('have.value', value);
});

When('user clears {string} input field', (fieldLabel) => {
	cy.get(`input[aria-label="${fieldLabel}"]`).clear();
});

And('user clicks on {string} button', (buttonLabel) => {
	cy.get('button').contains(buttonLabel).click({ force: true });
});
