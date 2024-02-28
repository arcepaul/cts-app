/// <reference types="Cypress" />
import { And, When, Then } from 'cypress-cucumber-preprocessor/steps';

const keywordsFields = {
	Keywords: 'keyword',
	KeywordsPhrases: 'keywordPhrases',
};

Then('help icon is displayed in {string} section with href {string}', (fieldLabel, helpHref) => {
	cy.get(`#fieldset--${keywordsFields[fieldLabel]}`).find('a.text-icon-help').should('have.attr', 'href', helpHref);
});

And('trial info displays {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});

And('the criteria table displays the following', (dataTable) => {
	let index = 0;
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').eq(index).should('have.text', Category);
		cy.get('tbody tr td').eq(index).should('have.text', Selection);
		index++;
	}
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

Then('{string} field has value {string}', (fieldLabel, value) => {
	cy.get(`input#${keywordsFields[fieldLabel]}`).should('have.value', value);
});

When('user clears {string} input field', (fieldLabel) => {
	cy.get(`input#${keywordsFields[fieldLabel]}`).clear();
});
