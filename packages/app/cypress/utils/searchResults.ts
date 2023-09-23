export function checkSearchResults({ items, metadata, pages }) {
  cy.findByTestId("results-count")
    .scrollIntoView()
    .should("be.visible")
    .contains(
      new RegExp(
        `${metadata.totalResults} results for "${metadata.searchTerms}"`,
        "i"
      )
    );
  expect(items.length).to.be.equal(10);
  items.forEach((item, idx) => {
    cy.findByTestId(`search-result-${idx}`)
      .scrollIntoView()
      .within(() => {
        cy.findByText(item.link)
          .should("be.visible")
          .parent()
          .should("have.attr", "href", item.link);
        cy.findByText(item.title)
          .should("be.visible")
          .parent()
          .should("have.attr", "href", item.link);
      });
  });
  cy.findByTestId("pagination-controls").scrollIntoView().should("be.visible");
}
