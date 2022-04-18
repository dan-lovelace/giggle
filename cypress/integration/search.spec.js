/// <reference types="cypress" />

import { ENDPOINTS } from "../../lib/endpoints";
import enginesJson from "../fixtures/engines.json";

const enginesMock = JSON.parse(JSON.stringify(enginesJson));

describe("Search", () => {
  describe("Homepage", () => {
    beforeEach(() => {
      cy.intercept(ENDPOINTS.ENGINES, { fixture: "engines.json" }).as(
        "engines"
      );
    });

    it("should allow changing the engine", () => {
      cy.visit("/");
      cy.findByTestId("engines-button").click();
      cy.findByTestId("engines-menu").should("be.visible");
      enginesMock.forEach((engine) => {
        cy.contains(engine.name).should("be.visible");
      });
      cy.contains(enginesMock[1].name).click();
      cy.findByTestId("engines-button").contains(enginesMock[1].name);
      cy.findByTestId("engines-menu").should("not.exist");
    });

    it("should not allow search without query", () => {
      cy.visit("/");
      cy.findByTestId("query-input").type("{enter}");
      cy.wait(500);
      cy.url().should("not.include", "/results");
    });

    it("should redirect to results when searching the default engine", () => {
      cy.intercept(
        {
          pathname: `${ENDPOINTS.SEARCH}*`,
          query: {
            page: "1",
          },
        },
        { fixture: "search-page-1.json" }
      ).as("searchPage1");
      cy.visit("/");
      cy.findByTestId("query-input").type("test search{enter}");
      cy.url().should(
        "include",
        `/results?engine=${enginesMock[0].id}&query=test+search&page=1`
      );
      cy.wait("@searchPage1");
      cy.findByTestId("query-input")
        .get("input")
        .should("have.value", "test search");
      cy.findByTestId("engines-button").contains(enginesMock[0].name);
      cy.findByTestId("results-count")
        .should("be.visible")
        .contains(/\d results/i);
    });

    it("should redirect to results after selecting an engine", () => {
      cy.intercept(
        {
          pathname: `${ENDPOINTS.SEARCH}*`,
          query: {
            page: "1",
          },
        },
        { fixture: "search-page-1.json" }
      ).as("searchPage1");
      cy.visit("/");
      cy.findByTestId("engines-button").click();
      cy.contains(enginesMock[1].name).click();
      cy.findByTestId("query-input").type("test search{enter}");
      cy.url().should(
        "include",
        `/results?engine=${enginesMock[1].id}&query=test+search&page=1`
      );
      cy.findByTestId("query-input")
        .get("input")
        .should("have.value", "test search");
      cy.findByTestId("engines-button").contains(enginesMock[1].name);
      cy.findByTestId("results-count")
        .should("be.visible")
        .contains(/\d results/i);
    });
  });

  describe("Search Results Page", () => {
    beforeEach(() => {
      cy.intercept(ENDPOINTS.ENGINES, { fixture: "engines.json" }).as(
        "engines"
      );
      cy.intercept(`${ENDPOINTS.SEARCH}*`, {
        fixture: "search-page-1.json",
      }).as("searchPage1");
    });

    it("should allow changing the engine", () => {
      cy.visit(`/results?engine=${enginesMock[0].id}&query=test+search&page=1`);
      cy.findByTestId("engines-button").click();
      cy.findByTestId("engines-menu").should("be.visible");
      enginesMock.forEach((engine) => {
        cy.contains(engine.name).should("be.visible");
      });
      cy.contains(enginesMock[1].name).click();
      cy.findByTestId("engines-button").contains(enginesMock[1].name);
      cy.findByTestId("engines-menu").should("not.exist");
    });

    it("should not allow search without query", () => {
      cy.visit(`/results?engine=${enginesMock[0].id}&query=test+search&page=1`);
      cy.findByTestId("query-input").get("input").clear().type("{enter}");
      cy.wait(2000);
      cy.get("@searchPage1.all").then((interceptions) => {
        expect(interceptions).to.have.length(1);
      });
    });

    it("should allow follow-up searches", () => {
      cy.visit(`/results?engine=${enginesMock[0].id}&query=test+search&page=1`);
      cy.findByTestId("query-input").get("input").clear().type("test{enter}");
      cy.wait(2000);
      cy.get("@searchPage1.all").then((interceptions) => {
        expect(interceptions).to.have.length(2);
      });
    });
  });
});
