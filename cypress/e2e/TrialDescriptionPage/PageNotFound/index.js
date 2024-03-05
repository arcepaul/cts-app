/// <reference types="Cypress" />
import { And } from 'cypress-cucumber-preprocessor/steps';

cy.on('uncaught:exception', () => {
	// returning false here prevents Cypress from
	// failing the test
	return false;
});
And('{string} button as link is displayed', (btnText) => {
	cy.get('div[class*="btnAsLink"]').should('have.text', btnText).and('be.visible');
});

And('the text {string} appears on the page', (text) => {
	cy.get('div.error-container').should('contain', text);
});

And('the following links and texts exist on the page', (dataTable) => {
	// Split the data table into array of pairs
	const rawTable = dataTable.rawTable.slice();

	// get the link with the provided url and assert it's text
	for (let i = 0; i < rawTable.length; i++) {
		const row = rawTable[i];
		cy.get(`#main-content a[href='${row[0]}']`).should('have.text', row[1]);
	}
});

And('the search bar appears below', () => {
	cy.get('input#keywords').should('be.visible');
});
