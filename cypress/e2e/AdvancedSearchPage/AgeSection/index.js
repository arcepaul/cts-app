/// <reference types="Cypress" />
import { Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { fieldMap } from '../../../utils/ctsFields.js';

Then('help icon is displayed in {string} section with href {string}', (fieldLabel, helpHref) => {
	cy.get(`#fieldset--${fieldMap[fieldLabel]}`).find('a.text-icon-help').should('have.attr', 'href', helpHref);
});

Then('alert {string} is displayed', (alertText) => {
	cy.get('.cts-input__error-message').should('have.text', alertText);
});

Then('alert is not displayed', () => {
	cy.get('article').find('.cts-input__error-message').should('not.exist');
});

When('user clears {string} input field', (fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).clear();
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});
Then('{string} field has value {string}', (label, value) => {
	cy.get(`input#${label.toLowerCase()}`).should('have.value', value);
});

And('trial info displayes {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});
Then('age field has value {string}', (value) => {
	cy.get(`input#age`).should('have.value', value);
});

Then('the search is not executed and path is {string}', (path) => {
	cy.location('pathname').should('equal', path);
});

And('the criteria table displays the following', (dataTable) => {
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').should('have.text', Category);
		cy.get('tbody tr td').should('have.text', Selection);
	}
});
