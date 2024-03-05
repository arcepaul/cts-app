/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

And('info text {string} is displayed in the section body', (infoText) => {
	cy.get('#fieldset--trialphase').find('p').should('have.text', infoText);
});

And('the following checkboxes are displayed', (dataTable) => {
	for (const { label, value } of dataTable.hashes()) {
		cy.get(`#fieldset--trialphase label[for='${value}']`).should('have.text', label).and('have.attr', 'for', value);
	}
});

And('help icon is displayed in {string} section with href {string}', (section, href) => {
	cy.get(`#fieldset--${section.replace(' ', '').toLowerCase()}`)
		.find('a')
		.should('have.attr', 'href', href);
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

And('trial info displayes {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
});

Then('the checkbox {string} is checked', (checkBox) => {
	cy.get('label').contains(checkBox).parent().find('input').should('be.checked');
});

Then('the checkbox {string} is not checked', (checkBox) => {
	cy.get('label').contains(checkBox).parent().find('input').should('not.be.checked');
});

When('user checks {string} checkbox', (label) => {
	cy.get('#fieldset--trialphase').find('label').contains(label).parent().find('input').check({ force: true });
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

And('the url query has the following corresponding code with duplicated keys', (dataTable) => {
	cy.location('href').then((url) => {
		const params = new URL(url).searchParams;
		//verify num of url params matches expected
		expect(Array.from(params.entries()).length).to.eq(dataTable.raw().length);
		//verify that url query params have expected values
		expect(Array.from(params.entries())).to.deep.equal(dataTable.raw());
	});
});
