/// <reference types="Cypress" />
import { Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { fieldMap } from '../../../utils/ctsFields.js';

And('help icon is displayed in {string} section with href {string}', (fieldLabel, helpHref) => {
	cy.get('#fieldset--trialInvestigators').find('a.text-icon-help').should('be.visible', fieldLabel).and('have.attr', 'href', helpHref);
});

Then('autocomplete dropdown is displayed with {string} text', (autosuggestItem) => {
	cy.get('div.cts-autocomplete__menu-item:visible').should('have.text', autosuggestItem);
});

Then('autocomplete dropdown is displayed', () => {
	cy.get('div.cts-autocomplete__menu-item:visible').should('be.visible');
});

And('user selects {string} from dropdown', (autosuggestTerm) => {
	cy.get('div.cts-autocomplete__menu.--trialInvestigators').should('be.visible');
	cy.get('div.cts-autocomplete__menu.--trialInvestigators div.highlighted:visible').should('have.text', autosuggestTerm).click();
});

And('trial info displayes {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});

And('the criteria table displays the following', (dataTable) => {
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').should('have.text', Category);
		cy.get('tbody tr td').should('have.text', Selection);
	}
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

Then('Trial Investigators field has value {string}', (value) => {
	cy.get(`input#inv`).should('have.value', value);
});

When('user clears {string} input field', (fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).clear();
});
