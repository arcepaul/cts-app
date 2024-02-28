/// <reference types="Cypress" />
import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { fieldMap } from '../../utils/ctsFields.js';

cy.on('uncaught:exception', () => {
	// returning false here prevents Cypress from
	// failing the test
	return false;
});

Given('the user navigates to {string}', (destURL) => {
	cy.visit(destURL);
});

Given('{string} is set to {string}', (key, param) => {
	cy.on('window:before:load', (win) => {
		win.INT_TEST_APP_PARAMS[key] = param;
	});
});

When('the user navigates to {string}', (def) => {
	cy.visit(def);
});

Then('the page title is {string}', (title) => {
	cy.get('h1').should('contain', title);
});

And('browser waits', () => {
	cy.wait(6000);
});

Given('screen breakpoint is set to {string}', (screenSize) => {
	if (screenSize === 'desktop') cy.viewport(1025, 600);
	else if (screenSize === 'mobile') cy.viewport(600, 800);
	else if (screenSize === 'tablet') cy.viewport(800, 900);
});

When('user clicks on {string} field', (fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).click();
});

When('user types {string} in {string} field', (inputText, fieldLabel) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).type(inputText);
});

When('user scrolls down to {string}', (landmark) => {
	cy.get('legend').contains(landmark).scrollIntoView();
});

When('user clicks on {int} trial result', (resultItem) => {
	cy.get('.results-list__item a')
		.eq(resultItem - 1)
		.click();
});

And('user clicks on {string} button', (buttonLabel) => {
	cy.get('button').contains(buttonLabel).click();
});

And('user clicks on {string} link', (linkText) => {
	cy.get('a').contains(linkText).click({ followRedirect: false });
});

And('user navigates back to the previous page', () => {
	cy.window().then((win) => {
		cy.NCIDataLayer = Object.assign(win.NCIDataLayer);
	});
	cy.go('back'), { followRedirect: false };
});
And('user clears form', () => {
	cy.window().then((win) => {
		cy.NCIDataLayer = Object.assign(win.NCIDataLayer);
	});
	cy.get('button').contains('Clear Form').click();
});

When('user scrolls to middle of screen', () => {
	cy.scrollTo('center');
});

When('user checks {string} checkbox', (label) => {
	cy.get('label').contains(label).parent().find('input').check({ force: true });
});

When('user checks {string} checkbox on {int} pages', (label, page) => {
	for (let i = 1; i <= page; i++) {
		cy.contains('button.pager__button', `${i}`).click();
		cy.get('label').contains(label).parent().find('input').check({ force: true });
	}
});

When('user clicks on share by {string} button', (option) => {
	if (option === 'Print') {
		cy.window().then((win) => {
			//same approach we used on platform testig and it works, in the app it does not!(
			//stubbing the print window to prevent the call to open it,
			//but still triggering the click event
			cy.stub(win, 'print');
			cy.get('button').contains(option).click({ force: true });
		});
	} else {
		cy.get('button[class="share-btn cts-share-email"]')
			.then((button$) => {
				button$.on('click', (e) => {
					//this is useless since cypress still waits for a new page to load
					// and it never loads - timeout and fail!
					e.preventDefault;
				});
			})
			.click({ force: true });
	}
});

And('{string} form section is displayed', (sectionLabel) => {
	cy.get('legend').contains(sectionLabel).should('be.visible');
});

And('button {string} is displayed', (buttonLabel) => {
	cy.get('button').contains(buttonLabel).should('be.visible');
});

Then('the search is executed and results page is displayed', () => {
	cy.location('pathname').should('contain', '/r');
	cy.get('h1').should('have.text', 'Clinical Trials Search Results');
	cy.get('div[class="results-list"]').should('be.visible');
});

Then('the search is executed and no results page is displayed', () => {
	cy.location('pathname').should('contain', '/r');
	cy.get('h1').should('have.text', 'Clinical Trials Search Results');
	cy.get('div[class="results-list no-results"]').should('be.visible');
});

And('the url query has the following corresponding code', (dataTable) => {
	cy.location('href').then((url) => {
		const params = new URL(url).searchParams;
		//verify num of url params matches expected
		expect(Array.from(params.entries()).length).to.eq(dataTable.rows().length);
		//verify that url query params have expected values
		Array.from(params.entries()).map(([pkey, pvalue]) => {
			for (const { parameter, value } of dataTable.hashes()) {
				if (parameter === pkey) {
					expect(pvalue).equal(value);
				}
			}
		});
	});
});

And('helper text {string} is displayed', (helperText) => {
	cy.get('span').contains(helperText).should('be.visible');
});

Then('{string} input field has a placeholder {string}', (fieldLabel, placeholderText) => {
	cy.get(`input#${fieldMap[fieldLabel]}`).should('have.attr', 'placeholder', placeholderText);
});

Then('autocomplete dropdown is displayed with {string} text', (autosuggestItem) => {
	cy.get('div.cts-autocomplete__menu-item').should('have.text', autosuggestItem);
});

And('{string} link has a href {string}', (linkText, linkHref) => {
	cy.get('a').contains(linkText).should('have.attr', 'href', linkHref);
});

And('the following delighters are displayed', (dataTable) => {
	for (const { delighter, href, title, text } of dataTable.hashes()) {
		cy.get(`div[class="delighter ${delighter}"]`).as('delighter');
		cy.get('@delighter').find('a').should('have.attr', 'href', href);
		cy.get('@delighter').find('h4').should('have.text', title);
		cy.get('@delighter').find('p').should('have.text', text);
	}
});

Then('help icon is displayed with href {string}', (helpHref) => {
	cy.get('a.text-icon-help').should('have.attr', 'href', helpHref);
});

Then('the Age for result {int} displays the following {string}', (resultItemNum, ageText) => {
	cy.get('.results-list__item span')
		.eq(resultItemNum - 1)
		.get('.results-list-item__category')
		.contains(ageText);
});
