import { TSearchResults } from "@giggle/types";

export function checkSearchResults({
  items,
  metadata,
  searchInformation,
}: TSearchResults) {
  cy.findByTestId("results-count").scrollIntoView();
  cy.findByTestId("results-count")
    .should("be.visible")
    .contains(
      new RegExp(
        `${searchInformation?.formattedTotalResults} results for "${metadata?.searchTerms}"`,
        "i",
      ),
    );
  cy.findAllByTestId("search-result").then((results) => {
    expect(results.length).to.equal(items.length);

    cy.wrap(results).each((result, idx) => {
      const searchResult = items[idx];

      cy.wrap(result).scrollIntoView();
      cy.wrap(result).within(() => {
        cy.findByText(searchResult.link)
          .should("be.visible")
          .parent()
          .should("have.attr", "href", searchResult.link);
        cy.findByText(searchResult.title)
          .should("be.visible")
          .parent()
          .should("have.attr", "href", searchResult.link);
      });
    });
  });
  cy.findByTestId("pagination-controls").scrollIntoView();
  cy.findByTestId("pagination-controls").should("be.visible");
}
