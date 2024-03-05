/// <reference types="Cypress" />
import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('user checks {string} checkbox at the {string} of a page', (label, position) => {
	let index;
	if (position.toLowerCase().includes('top')) {
		index = 0;
	} else {
		index = 1;
	}
	cy.get('label').contains(label).eq(index).parent().find('input').click({ force: true });
});
Then('all of the trials are selected', () => {
	cy.get('.results-list .cts-checkbox .cts-checkbox__label').each(($el) => {
		const win = $el[0].ownerDocument.defaultView;
		// use getComputedStyle to read the pseudo selector
		const before = win.getComputedStyle($el[0], '::before');
		// read the value of the `content` CSS property
		const contentValue = before['background-image'];
		// the returned value will have double quotes around it, but this is correct
		expect(contentValue).to.eq('url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIxNiAxNDYiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xNjguODYgMzcuOTY2bC0xMS4wOC0xMS4wOGMtMS41Mi0xLjUyLTMuMzY3LTIuMjgtNS41NC0yLjI4LTIuMTcyIDAtNC4wMi43Ni01LjU0IDIuMjhMOTMuMjU0IDgwLjQxNCA2OS4zIDU2LjM4Yy0xLjUyLTEuNTIyLTMuMzY3LTIuMjgyLTUuNTQtMi4yODItMi4xNzIgMC00LjAyLjc2LTUuNTQgMi4yOEw0Ny4xNCA2Ny40NmMtMS41MiAxLjUyMi0yLjI4IDMuMzctMi4yOCA1LjU0MiAwIDIuMTcyLjc2IDQuMDIgMi4yOCA1LjU0bDI5LjQ5MyAyOS40OTMgMTEuMDggMTEuMDhjMS41MiAxLjUyIDMuMzY4IDIuMjggNS41NCAyLjI4IDIuMTczIDAgNC4wMi0uNzYgNS41NC0yLjI4bDExLjA4Mi0xMS4wOEwxNjguODYgNDkuMDVjMS41Mi0xLjUyIDIuMjgzLTMuMzcgMi4yODMtNS41NCAwLTIuMTc0LS43Ni00LjAyLTIuMjgtNS41NHoiLz48L3N2Zz4="), linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))');
	});
});
When('user checks {string} trial', (trialID) => {
	cy.get(`label[for="${trialID}"]`).parent().find('input').click({ force: true });
});
Then('the checkbox for trial {string} is checked', (trialID) => {
	cy.get(`label[for="${trialID}"]`).each(($el) => {
		const win = $el[0].ownerDocument.defaultView;
		// use getComputedStyle to read the pseudo selector
		const before = win.getComputedStyle($el[0], '::before');
		// read the value of the `content` CSS property
		const contentValue = before['background-image'];
		// the returned value will have double quotes around it, but this is correct
		expect(contentValue).to.eq('url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIxNiAxNDYiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xNjguODYgMzcuOTY2bC0xMS4wOC0xMS4wOGMtMS41Mi0xLjUyLTMuMzY3LTIuMjgtNS41NC0yLjI4LTIuMTcyIDAtNC4wMi43Ni01LjU0IDIuMjhMOTMuMjU0IDgwLjQxNCA2OS4zIDU2LjM4Yy0xLjUyLTEuNTIyLTMuMzY3LTIuMjgyLTUuNTQtMi4yODItMi4xNzIgMC00LjAyLjc2LTUuNTQgMi4yOEw0Ny4xNCA2Ny40NmMtMS41MiAxLjUyMi0yLjI4IDMuMzctMi4yOCA1LjU0MiAwIDIuMTcyLjc2IDQuMDIgMi4yOCA1LjU0bDI5LjQ5MyAyOS40OTMgMTEuMDggMTEuMDhjMS41MiAxLjUyIDMuMzY4IDIuMjggNS41NCAyLjI4IDIuMTczIDAgNC4wMi0uNzYgNS41NC0yLjI4bDExLjA4Mi0xMS4wOEwxNjguODYgNDkuMDVjMS41Mi0xLjUyIDIuMjgzLTMuMzcgMi4yODMtNS41NCAwLTIuMTc0LS43Ni00LjAyLTIuMjgtNS41NHoiLz48L3N2Zz4="), linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))');
	});
});
Then('the checkbox for trial {string} is not checked', (trialID) => {
	cy.get(`label[for="${trialID}"]`).each(($el) => {
		const win = $el[0].ownerDocument.defaultView;
		// use getComputedStyle to read the pseudo selector
		const before = win.getComputedStyle($el[0], '::before');
		// read the value of the `content` CSS property
		const contentValue = before['background-image'];
		// the returned value will have double quotes around it, but this is correct
		expect(contentValue).to.eq('none');
	});
});

Then('the checkbox {string} is checked', (checkBox) => {
	cy.get('label').contains(checkBox).parent().find('input').should('be.checked');
});

Then('the checkbox {string} is not checked', (checkBox) => {
	cy.get('label').contains(checkBox).parent().find('input').should('not.be.checked');
});

And('result list is displayed', () => {
	cy.get('div.results-list').should('be.visible');
});

Then('print modal appears', () => {
	cy.get('.cts-modal').should('be.visible');
});
And('the request is sent with the following details', (dataTable) => {
	cy.get('@print').then((xhr) => {
		for (const { link_template, new_search_link, search_criteria } of dataTable.hashes()) {
			expect(xhr.request.body.link_template).to.eq(link_template);
			expect(xhr.request.body.new_search_link).to.eq(new_search_link);
			if (search_criteria === 'notNull') expect(xhr.request.body.search_criteria).to.not.be.null;
			else expect(xhr.request.body.search_criteria).to.be.null;
		}
	});
});

And('the request is sent with the following trial ids', (dataTable) => {
	cy.wait('@print').then((xhr) => {
		const allIds = xhr.request.body.trial_ids;
		let count = 0;
		expect(xhr.request.body.trial_ids).to.have.length(dataTable.rows().length);
		for (const { trialId } of dataTable.hashes()) {
			expect(allIds[count]).to.include(trialId);
			count++;
		}
	});
});

And('user clicks on {string} button', (buttonLabel) => {
	cy.intercept('POST', '/mock-api/cts-print/GenCache*').as('print');
	cy.get('button').contains(buttonLabel).click({ force: true });
});

When('user clicks on {string} pager button', (pgButton) => {
	cy.get('.pager__button').contains(pgButton).click();
});

And('print modal displayes {string}', (text) => {
	cy.get('.cts-modal').find('p').should('have.text', text);
});

When('user closes the modal', () => {
	cy.get('#modalCloseRef').click();
});
Then('print modal is no longer displayed', () => {
	cy.get('.cts-modal').should('not.exist');
});
