/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { fieldMap } from '../../../utils/ctsFields.js';

And('the following checkboxes are displayed', (dataTable) => {
	for (const { label, value } of dataTable.hashes()) {
		cy.get(`div.cts-checkbox.check-all label[for='${value}']`).should('have.text', label).and('have.attr', 'for', value);
	}
});

And('button {string} is displayed at {string} position', (printButtonText, printButtonPosition) => {
	cy.get(`button.results-page__print-button[data-pos='${printButtonPosition}']`).should('have.text', printButtonText).and('have.attr', 'data-pos', printButtonPosition);
});

And('results pager is displayed at {string} position', (pagerPosition) => {
	cy.get('div.results-page__pager').should('have.css', pagerPosition);
});

And('result list is displayed', () => {
	cy.get('div.results-list').should('be.visible');
});

And('each result item has a checkbox', () => {
	cy.document().then((doc) => {
		const checkboxLocator = doc.querySelectorAll('.results-page__list .results-list-item__checkbox');
		for (let i = 0; i < checkboxLocator.length - 1; i++) {
			cy.get(checkboxLocator[i]).should('be.visible');
		}
	});
});

And('each result item has title as a link', () => {
	cy.document().then((doc) => {
		const titleLocator = doc.querySelectorAll('.results-list-item__title');
		for (let i = 0; i < titleLocator.length - 1; i++) {
			cy.get(titleLocator[i]).should('be.visible');
			cy.get(titleLocator[i]).find('a').should('have.attr', 'href');
		}
	});
});

And('each result item has the following information', (dataTable) => {
	for (const { Category } of dataTable.hashes()) {
		cy.get('div.results-list-item__category span').contains(Category).should('be.visible');
	}
});

And('search criteria accordion is displayed', () => {
	cy.get('.cts-accordion.table-dropdown').should('be.visible');
});

And('button {string} is displayed', (searchCriteriaButton) => {
	cy.get('button.cts-accordion__button').should('be.visible').and('contain.text', searchCriteriaButton);
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

When('user clicks on {string} link', (link) => {
	cy.get('a').contains(link).click();
});
Then('user is taken back to {string} search page', (searchType) => {
	if (searchType.toLowerCase().includes('advanced')) {
		cy.location('pathname').should('eq', '/advanced');
	} else if (searchType.toLowerCase().includes('basic')) {
		cy.location('pathname').should('eq', '/');
	} else {
		throw new Error('please provide either Basic or Advanced search page');
	}
});
And('the following fields have been cleared out', (dataTable) => {
	for (const { Field } of dataTable.hashes()) {
		cy.get(`input#${fieldMap[Field]}`).should('have.value', '');
	}
});

And('trial info displayes {string}', (infoText) => {
	cy.get('.all-trials').should('include.text', infoText);
});

And('{string} link has a href {string}', (linkText, linkHref) => {
	cy.get(`a[href="${linkHref}"]`).should('include.text', linkText);
});

And('{string} button is displayed', (buttonLabel) => {
	if (buttonLabel.includes('Show Search Criteria')) {
		cy.get('.cts-accordion__button').contains(buttonLabel).should('be.visible');
	} else if (buttonLabel.includes('Modify Search Criteria')) {
		cy.get('.btnAsLink').contains(buttonLabel).should('be.visible');
	}
});

When('user clicks on Modify Search Criteria button', () => {
	cy.get('button.btnAsLink').contains('Modify Search Criteria').click();
});

And('user selects {string} radio button', (label) => {
	cy.get(`input#search-location-${label.toLowerCase()}`).click({ force: true });
});

And('user selects {string} from dropdown', (keyword) => {
	cy.get('.cts-autocomplete__menu-item').contains(keyword).click();
});

And('user types {string} in {string} autosuggest field', (text, fieldLabel) => {
	cy.get(`input[aria-label="${fieldLabel.toLowerCase()}"]`).type(text);
});

Then('all of the trials are not selected', () => {
	cy.get('.results-list .cts-checkbox .cts-checkbox__label').each(($el) => {
		const win = $el[0].ownerDocument.defaultView;
		// use getComputedStyle to read the pseudo selector
		const before = win.getComputedStyle($el[0], ':before');
		// read the value of the `content` CSS property
		const contentValue = before['background-image'];
		// the returned value will have double quotes around it, but this is correct
		expect(contentValue).to.eq('none');
	});
});

And('there are {int} delighters present', (count) => {
	cy.get('.cts-delighter-container div[class^="delighter"]:visible').should('have.length', count);
});

And('the following delighters are displayed', (dataTable) => {
	for (const { delighter, href, title, text } of dataTable.hashes()) {
		cy.get(`div[class="delighter ${delighter}"]:visible`).as('delighter');
		cy.get('@delighter').find('a').should('have.attr', 'href', href);
		cy.get('@delighter').find('h4').should('have.text', title);
		cy.get('@delighter').find('p').should('have.text', text);
	}
});

And('{string} no trial info is displayed', (noTrialsText) => {
	cy.get('.no-results').should('have.text', noTrialsText);
});

And('{string} text is displayed as results header', (resHeader) => {
	cy.get('div[class="results-list no-results"]').should('include.text', resHeader);
});

And('text {string} is displayed', (text) => {
	cy.get('div').contains(text).should('be.visible');
});

And('{string} has a link {string}', (link, href) => {
	cy.get('form').should('have.attr', 'action', href);
	cy.get('form button').should('have.text', link);
});

When('user removes {string} from the {string} field', (selectedType, fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).parent('.cts-chip-list').as('fieldInFocus');
	cy.get('@fieldInFocus').find(`button[value="${selectedType}"]`).click();
});

And('the invalid criteria table displays the following', (dataTable) => {
	cy.get('ul > li').should('have.length', dataTable.rows().length);
	for (const { Criteria } of dataTable.hashes()) {
		cy.get('ul > li').contains(`${Criteria}`).should('exist');
	}
});

When('user clears {string} input field', (fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).clear();
});

let stub;

When('user clicks on chat online button', () => {
	cy.get('form').then((form$) => {
		form$.on('submit', (e) => {
			e.preventDefault();
		});
	});
	cy.window().then((win) => {
		stub = cy.stub(win, 'open').as('windowOpen');
		cy.get('.btnAsLink.chat-link').click();
	});
});
Then('the chat is opened', () => {
	expect(stub).to.be.calledOnce;
});
