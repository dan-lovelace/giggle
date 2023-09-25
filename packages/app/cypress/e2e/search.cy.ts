/// <reference types="cypress" />

import { DBTEngine } from "@giggle/types";

import { ENDPOINTS } from "../../src/lib/endpoints";
import { ROUTES } from "../../src/lib/routes";

describe("search", () => {
  describe("homepage", () => {
    beforeEach(() => {
      cy.intercept(ENDPOINTS.ENGINES, { fixture: "engines-get.json" }).as(
        "enginesGet",
      );
    });

    it("should allow changing the engine", () => {
      cy.visit(ROUTES.HOMEPAGE);
      cy.findByTestId("engines-button").click();
      cy.findByTestId("engines-menu").should("be.visible");
      cy.wait("@enginesGet").then(({ response }) => {
        const secondEngine: DBTEngine = response?.body[1];

        cy.findByTestId("engines-menu").within(() => {
          response?.body.forEach((engine: DBTEngine) => {
            cy.contains(engine.name).should("be.visible");
          });

          cy.contains(secondEngine.name).click();
        });
        cy.findByTestId("engines-button").contains(secondEngine.name);
        cy.findByTestId("engines-menu").should("not.exist");
      });
    });

    it("should redirect to results when searching the default engine", () => {
      cy.intercept(
        {
          pathname: `${ENDPOINTS.SEARCH}*`,
          query: {
            page: "1",
          },
        },
        { fixture: "search-page-1.json" },
      ).as("searchPage1");
      cy.visit(ROUTES.HOMEPAGE);
      cy.wait("@enginesGet").then(({ response }) => {
        const firstEngine: DBTEngine = response?.body[0];

        cy.findByTestId("query-input").type("test search{enter}");
        cy.url().should(
          "include",
          `/results?engine=${firstEngine.identifier}&query=test+search&page=1`,
        );
        cy.wait("@searchPage1");
        cy.findByTestId("query-input")
          .get("input")
          .should("have.value", "test search");
        cy.findByTestId("engines-button").contains(firstEngine.name);
        cy.findByTestId("results-count")
          .should("be.visible")
          .contains(/[0-9,]* results/g);
      });
    });

    it("should redirect to results after selecting an engine", () => {
      cy.intercept(
        {
          pathname: `${ENDPOINTS.SEARCH}*`,
          query: {
            page: "1",
          },
        },
        { fixture: "search-page-1.json" },
      ).as("searchPage1");
      cy.visit(ROUTES.HOMEPAGE);
      cy.findByTestId("engines-button").click();
      cy.wait("@enginesGet").then(({ response }) => {
        const query = "test search";
        const secondEngine: DBTEngine = response?.body[1];

        cy.contains(secondEngine.name).click();
        cy.findByTestId("query-input").type(`${query}{enter}`);
        cy.url().should(
          "include",
          `/results?engine=${secondEngine.identifier}&query=${query
            .split(" ")
            .join("+")}&page=1`,
        );
        cy.findByTestId("query-input").get("input").should("have.value", query);
        cy.findByTestId("engines-button").contains(secondEngine.name);
        cy.findByTestId("results-count")
          .should("be.visible")
          .contains(/[0-9,]* results/g);
      });
    });
  });

  describe("results page", () => {
    beforeEach(() => {
      cy.intercept(ENDPOINTS.ENGINES, { fixture: "engines-get.json" }).as(
        "enginesGet",
      );
      cy.intercept(`${ENDPOINTS.SEARCH}*`, {
        fixture: "search-page-1.json",
      }).as("searchPage1");
    });

    it("should allow changing the engine", () => {
      cy.visit(ROUTES.HOMEPAGE);

      cy.wait("@enginesGet").then(({ response }) => {
        const firstEngine: DBTEngine = response?.body[0];
        const secondEngine: DBTEngine = response?.body[1];

        cy.visit(
          `/results?engine=${firstEngine.identifier}&query=test+search&page=1`,
        );
        cy.findByTestId("engines-button").click();
        cy.findByTestId("engines-menu").should("be.visible");
        cy.findByTestId("engines-menu").within(() => {
          response?.body.forEach((engine: DBTEngine) => {
            cy.contains(engine.name).should("be.visible");
          });

          cy.contains(secondEngine.name).click();
        });
        cy.findByTestId("engines-button").contains(secondEngine.name);
        cy.findByTestId("engines-menu").should("not.exist");
      });
    });

    it("should allow follow-up searches", () => {
      cy.visit(ROUTES.HOMEPAGE);

      cy.wait("@enginesGet").then(({ response }) => {
        const firstEngine: DBTEngine = response?.body[0];

        cy.visit(
          `/results?engine=${firstEngine.identifier}&query=test+search&page=1`,
        );
        cy.findByTestId("query-input").get("input").clear();
        cy.findByTestId("query-input").get("input").type("test{enter}");
        cy.get("@searchPage1.all").then((interceptions) => {
          expect(interceptions).to.have.length(2);
        });
      });
    });
  });
});
