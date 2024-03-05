/// <reference types="Cypress" />
import { Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { fieldMap } from '../../../utils/ctsFields.js';

And('the text {string} appears below the title', (introtext) => {
	cy.get('.search-page__header > p').should('contain', introtext);
});

And('Search tip icon is displayed and text {string} appears', (tiptext) => {
	cy.get('.cts-search-tip__icon').should('be.visible');
	cy.get('.cts-search-tip__body').should('contain', tiptext);
});

And('sticky block is displayed with {string} and {string} buttons', (findbtn, clearbtn) => {
	cy.get('.sticky-block').should('be.visible');
	cy.get('.faux-btn-submit').contains(findbtn).should('be.visible');
	cy.get('.clear-form').contains(clearbtn).should('be.visible');
});

When('user scrolls to the {string} section', (section) => {
	cy.get(`input[aria-label="${section}"]`).scrollIntoView();
});

Then('sticky block becomes fixed block', () => {
	cy.get('.sticky-block__anchor --sticky').should('not.exist');
});

Then('{string} input field has no value', (section) => {
	cy.get(`input[id="${fieldMap[section]}"]`).should('be.empty');
});

When('user clicks on {string} with href {string}', (linktext, link) => {
	cy.get('.cts-search-tip__body a').should('have.text', linktext);
	cy.get('.cts-search-tip__body a').should('have.attr', 'href', link);
	cy.get('.cts-search-tip__body a').click();
});

Then('user is redirected to {string}', (link) => {
	cy.location('pathname').should('be.eq', link);
});
