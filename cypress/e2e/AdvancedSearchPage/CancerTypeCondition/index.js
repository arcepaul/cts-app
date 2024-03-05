/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { fieldMap } from '../../../utils/ctsFields';

And('info text {string} is displayed in the {string} section body', (infoText, fieldSet) => {
	cy.get(`fieldset.${fieldSet}`).find('p').should('contain.text', infoText);
});

And('autocomplete dropdown is displayed', () => {
	cy.get('.cts-autocomplete .menu-anchor :visible').should('exist');
});

And('user selects {string} from dropdown', (keyword) => {
	cy.get('.cts-autocomplete__menu-item').contains(keyword).click();
});

And('{string} input field has helper text {string}', (fieldLabel, helperText) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).parent().siblings('span').should('have.text', helperText);
});

And('trial info displayes {string}', (infoText) => {
	cy.get('.all-trials').should('have.text', infoText);
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

Then('{string} field has the following types selected', (fieldLabel, dataTable) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).parent('.cts-chip-list').as('fieldInFocus');
	//expected number of selected items is displayed
	cy.get('@fieldInFocus').find('span[class*="label"]').should('have.length', dataTable.rows().length);
	for (const { selected } of dataTable.hashes()) {
		//verify that the ony expected items are selected
		cy.get('@fieldInFocus').find('span[class*="label"]').contains(selected).should('be.visible');
	}
});

When('user removes {string} from the {string} field', (selectedType, fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).parent('.cts-chip-list').as('fieldInFocus');
	cy.get('@fieldInFocus').find(`button[value="${selectedType}"]`).click();
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

And('the criteria table displays the following', (dataTable) => {
	let index = 0;
	for (const { Category, Selection } of dataTable.hashes()) {
		cy.get('tbody tr th').eq(index).should('have.text', Category);
		cy.get('tbody tr td').eq(index).should('have.text', Selection);
		index++;
	}
});
