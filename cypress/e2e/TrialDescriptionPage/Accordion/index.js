/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

And('trial description accordion is displayed', () => {
	cy.get('.trial-description-page__content  .cts-accordion').should('be.visible');
});

And('the following accordion sections are displayed', (dataTable) => {
	for (const { section, ariaExpanded } of dataTable.hashes()) {
		cy.get('div[class="cts-accordion  "] button.cts-accordion__button').contains(section).parent().should('have.attr', 'aria-expanded', ariaExpanded);
	}
});

When('user clicks on {string} section of accordion', (section) => {
	cy.get('div[class="cts-accordion  "] button.cts-accordion__button').contains(section).click();
});

Then('alphabetically sorted list appears', () => {
	let isSorted = true;
	cy.document().then((document) => {
		//get all the options from select
		const options = document.querySelectorAll('select.cts-select option');
		for (let i = 1; i < options.length - 1; i++) {
			//localeCompare() returns a negative number when a reference string (option[i])
			//comes before compareString (option[i+1])
			if (options[i].textContent.localeCompare(options[i + 1].textContent) > 0) {
				isSorted = false;
				console.log(`${options[i].textContent} is out of order with ${options[i + 1].textContent}`);
			}
		}
		expect(isSorted).to.be.true;
	});
});

And('{string} option is selected', (selectedOption) => {
	cy.get('select.cts-select option:selected').should('have.text', selectedOption);
});

And('trial ids are displayed in the following format', (dataTable) => {
	for (const { id } of dataTable.hashes()) {
		cy.get('ul.trial-ids li').contains(id).should('be.visible');
	}
});

And('{string} button as link is displayed', (buttonAsLink) => {
	cy.get('div.btnAsLink').contains(buttonAsLink).should('be.visible');
});

And('text {string} is displayed', (text) => {
	cy.get('p').contains(text).should('be.visible');
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

And('the matched location displays the following information', (dataTable) => {
	cy.get('.sites-nearby .location').as('nearLocation');
	cy.get('@nearLocation').find('strong').should('include.text', dataTable.raw()[0].toString());
	for (let i = 0; i < dataTable.rows().length; i++) {
		cy.get('@nearLocation')
			.find('div')
			.eq(i)
			.should('have.text', dataTable.raw()[i + 1].toString());
	}
});

When('user selects {string} from the state dropdown list', (state) => {
	cy.get('select.cts-select').select(state);
});

And('the filtered by state location number {int} displays the following information', (index, dataTable) => {
	cy.get('.location-city')
		.eq(index - 1)
		.as('location');
	cy.get('@location').find('h5').should('include.text', dataTable.raw()[0].toString());
	cy.get('@location').find('strong').should('include.text', dataTable.raw()[1].toString());
	for (let i = 0; i < dataTable.rows().length - 2; i++) {
		cy.get('@location')
			.find(' .location')
			.find('div')
			.eq(i)
			.should('have.text', dataTable.raw()[i + 2].toString());
	}
});

Then('the location section is empty', () => {
	cy.get('.sites-all').should('be.empty');
});

Then('alphabetically sorted list of countries appears', () => {
	let isSorted = true;
	cy.document().then((document) => {
		//get all the options from select
		const options = document.querySelectorAll('select.cts-select'[0].children);
		for (let i = 1; i < options.length - 1; i++) {
			//localeCompare() returns a negative number when a reference string (option[i])
			//comes before compareString (option[i+1])
			if (options[i].textContent.localeCompare(options[i + 1].textContent) > 0) {
				isSorted = false;
				console.log(`${options[i].textContent} is out of order with ${options[i + 1].textContent}`);
			}
		}
		expect(isSorted).to.be.true;
	});
});
Then('alphabetically sorted list of states appears', () => {
	let isSorted = true;
	cy.document().then((document) => {
		//get all the options from select
		const options = document.querySelectorAll('select.cts-select'[1].children);
		for (let i = 1; i < options.length - 1; i++) {
			//localeCompare() returns a negative number when a reference string (option[i])
			//comes before compareString (option[i+1])
			if (options[i].textContent.localeCompare(options[i + 1].textContent) > 0) {
				isSorted = false;
				console.log(`${options[i].textContent} is out of order with ${options[i + 1].textContent}`);
			}
		}
		expect(isSorted).to.be.true;
	});
});

When('user selects {string} from countries list', (country) => {
	cy.get('select.cts-select').eq(0).select(country);
});

And('the filtered by country location number {int} displays the following information', (index, dataTable) => {
	cy.get('.location-city:visible')
		.eq(index - 1)
		.as('location');
	cy.get('@location').find('h5').should('include.text', dataTable.raw()[0].toString());
	cy.get('@location').find('strong').should('include.text', dataTable.raw()[1].toString());
	for (let i = 0; i < dataTable.rows().length - 2; i++) {
		cy.get('@location')
			.find(' .location')
			.find('div')
			.eq(i)
			.should('have.text', dataTable.raw()[i + 2].toString());
	}
});

And('button {string} is not displayed', (button) => {
	cy.get('.btnAsLink').contains(button).should('not.exist');
});

And('all locations in {string} are displayed', (country) => {
	cy.get('.sites-all h3').should('have.text', country);
});
