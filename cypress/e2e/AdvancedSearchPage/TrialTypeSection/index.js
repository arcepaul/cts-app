/// <reference types="Cypress" />
import { When, And } from 'cypress-cucumber-preprocessor/steps';

const fieldMap = {
	'Healthy Volunteers': 'hv',
	'Trial Type': 'trialtype',
};

const checkBoxes = {
	All: 'tt_all',
	Treatment: 'tt_treatment',
	Prevention: 'tt_prevention',
	'Supportive Care': 'tt_supportive_care',
	'Health Services Research': 'tt_health_services_research',
	Diagnostic: 'tt_diagnostic',
	Screening: 'tt_screening',
	'Basic Science': 'tt_basic_science',
	Other: 'tt_other',
};

And('help icon is displayed in {string} section with href {string}', (fieldLabel, helpHref) => {
	cy.get(`#fieldset--${fieldMap[fieldLabel]}`).find('a.text-icon-help').should('have.attr', 'href', helpHref);
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

And('info text {string} is displayed in the {string} section body', (text, fieldLabel) => {
	cy.get(`#fieldset--${fieldMap[fieldLabel]}`).get('.cts-fieldset__body>p').eq(0);
});

And('info text {string} is displayed in the {string} section body', (text, fieldLabel) => {
	cy.get(`#fieldset--${fieldMap[fieldLabel]}`).get('.cts-fieldset__body>p').eq(0);
});

And('{string} toggle is displayed with label {string}', (fieldLabel, text) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).siblings().get('.cts-toggle__label').should('have.attr', 'aria-label', text);
});

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

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

And('{string} checkbox is checked', (lbl) => {
	cy.get(`input#${checkBoxes[lbl]}`).should('be.checked');
});

And('{string} checkbox is not checked', (lbl) => {
	cy.get(`input#${checkBoxes[lbl]}`).should('not.be.checked');
});

And('user selects {string} checkbox', (chckBox) => {
	cy.get(`input#${checkBoxes[chckBox]}`).check({ force: true });
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
