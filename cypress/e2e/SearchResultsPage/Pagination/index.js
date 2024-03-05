import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

/*
	--------------
		Navigation
	--------------
*/
Then('the user is redirected to {string} with query parameters {string}', (redirectUrl, queryParams) => {
	cy.location('href').should('include', `${redirectUrl}?${queryParams}`);
});

/*
	---------
		Pager
	---------
*/
Then('the system displays {string} {string}', (perPage, total) => {
	cy.get('.paging-section__page-info').should('include.text', perPage).and('include.text', total);
});

And('result list is displayed', () => {
	cy.get('div.results-list').should('be.visible');
});

And('pager displays the following navigation options', (dataTable) => {
	const pagerItems = [];
	for (const { pages } of dataTable.hashes()) {
		pagerItems.push(pages);
	}
	let counter = 0;
	//verify that pager displays correct number of page items
	cy.get('.pager__navigation:first li:visible').should('have.length', pagerItems.length);
	cy.get('.pager__navigation:last li:visible').should('have.length', pagerItems.length);

	//verify that the order of displayed page items is correct
	cy.get('.pager__navigation:first li:visible').each(($el) => {
		cy.wrap($el).should('have.text', pagerItems[counter]);
		counter++;
	});
});

And('the page {string} is highlighted', (pageNum) => {
	cy.get('.pager__container:first .pager__navigation button.active').should('have.text', pageNum);
	cy.get('.pager__container:last .pager__navigation button.active').should('have.text', pageNum);
});

When('user clicks on {string} button', (arrow) => {
	cy.get('.pager__navigation li').contains(arrow).click();
});

When('pager is not displayed', () => {
	cy.get('.pager__navigation li').should('not.exist');
});

When('user clicks the browser back button', () => {
	cy.go('back');
});

When('user clicks the browser forward button', () => {
	cy.go('forward');
});
