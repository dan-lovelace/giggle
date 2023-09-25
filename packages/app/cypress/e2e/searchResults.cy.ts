/// <reference types="cypress" />

import { ENDPOINTS } from "../../src/lib/endpoints";
import enginesMock from "../fixtures/engines-get.json";
import { checkSearchResults } from "../utils/searchResults";

describe("Search Results", () => {
  beforeEach(() => {
    cy.intercept(ENDPOINTS.ENGINES, { fixture: "engines-get.json" }).as(
      "engines",
    );
    cy.intercept(
      {
        pathname: `${ENDPOINTS.SEARCH}*`,
        query: {
          page: "1",
        },
      },
      { fixture: "search-page-1.json" },
    ).as("searchPage1");
  });

  it("should fetch and display results", () => {
    cy.visit(
      `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
    );
    cy.wait("@searchPage1").then(({ response }) => {
      checkSearchResults(response?.body);
    });
  });

  it("should allow page change", () => {
    cy.intercept(
      {
        pathname: `${ENDPOINTS.SEARCH}*`,
        query: {
          page: "2",
        },
      },
      { fixture: "search-page-2.json" },
    ).as("searchPage2");
    cy.visit(
      `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
    );
    cy.wait("@searchPage1").then(({ response }) => {
      const page1 = response?.body;
      checkSearchResults(page1);
      cy.findByTestId("pagination-controls").scrollIntoView();
      cy.findByTestId("pagination-controls")
        .should("be.visible")
        .within(() => {
          cy.get("button")
            .contains("1")
            .then((button1) => {
              cy.wrap(button1)
                .should("be.visible")
                .should("have.attr", "aria-current", "true");

              cy.get("button")
                .contains("2")
                .then((button2) => {
                  cy.wrap(button2)
                    .should("be.visible")
                    .should("not.have.attr", "aria-current");
                  cy.wrap(button2).click();
                  cy.url().should(
                    "include",
                    `/results?engine=${enginesMock[0].identifier}&query=test+search&page=2`,
                  );
                  cy.wrap(button1).should("not.have.attr", "aria-current");
                  cy.wrap(button2).should("have.attr", "aria-current", "true");
                });
            });
        });

      cy.wait("@searchPage2").then(({ response }) => {
        checkSearchResults(response?.body);
      });
    });
  });

  it("should show 10 pagination buttons with more than 100 results", () => {
    cy.visit(
      `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
    );
    cy.wait("@searchPage1").then(() => {
      cy.findByTestId("pagination-controls").scrollIntoView();
      cy.findByTestId("pagination-controls").within(() => {
        cy.get("button").contains("10").should("be.visible");
      });
    });
  });

  it("should show less than 10 pagination buttons with less than 100 results", () => {
    cy.fixture("search-page-1.json").then((results) => {
      results.pages.splice(-5);
      cy.intercept(
        {
          pathname: `${ENDPOINTS.SEARCH}*`,
          query: {
            page: "1",
          },
        },
        results,
      ).as("searchPage1");
    });
    cy.visit(
      `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
    );
    cy.wait("@searchPage1").then(() => {
      cy.findByTestId("pagination-controls").scrollIntoView();
      cy.findByTestId("pagination-controls").within(() => {
        cy.get("button").contains("5").should("be.visible");
        cy.get("button").contains("6").should("not.exist");
      });
    });
  });

  it("should not show pagination buttons with 0 results", () => {
    cy.fixture("search-page-1.json").then((results) => {
      results.pages = [];
      cy.intercept(
        {
          pathname: `${ENDPOINTS.SEARCH}*`,
          query: {
            page: "1",
          },
        },
        results,
      ).as("searchPage1");
    });
    cy.visit(
      `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
    );
    cy.wait("@searchPage1").then(() => {
      cy.findByTestId("pagination-controls").should("not.exist");
    });
  });

  it("should update results when pressing the Back button", () => {
    cy.intercept(
      {
        pathname: `${ENDPOINTS.SEARCH}*`,
        query: {
          page: "2",
        },
      },
      { fixture: "search-page-2.json" },
    ).as("searchPage2");
    cy.visit(
      `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
    );
    cy.wait("@searchPage1").then(({ response }) => {
      const page1 = response?.body;

      cy.findByTestId("pagination-controls").scrollIntoView();
      cy.findByTestId("pagination-controls").within(() => {
        cy.get("button").contains("2").click();
      });
      cy.wait("@searchPage2");
      cy.go("back");
      cy.url().should(
        "include",
        `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
      );
      checkSearchResults(page1);
    });
  });

  it("should update results when pressing the Forward button", () => {
    cy.intercept(
      {
        pathname: `${ENDPOINTS.SEARCH}*`,
        query: {
          page: "2",
        },
      },
      { fixture: "search-page-2.json" },
    ).as("searchPage2");
    cy.visit(
      `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
    );
    cy.wait("@searchPage1").then(() => {
      cy.findByTestId("pagination-controls").scrollIntoView();
      cy.findByTestId("pagination-controls").within(() => {
        cy.get("button").contains("2").click();
      });
      cy.wait("@searchPage2").then(({ response }) => {
        const page2 = response?.body;
        cy.go("back");
        cy.url().should(
          "include",
          `/results?engine=${enginesMock[0].identifier}&query=test+search&page=1`,
        );
        cy.go("forward");
        cy.url().should(
          "include",
          `/results?engine=${enginesMock[0].identifier}&query=test+search&page=2`,
        );
        checkSearchResults(page2);
      });
    });
  });
});
