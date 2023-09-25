/// <reference types="cypress" />

import { DBTEngine } from "@giggle/types";

import { ENDPOINTS } from "../../src/lib/endpoints";
import { ROUTES } from "../../src/lib/routes";

describe("homepage", () => {
  it("should render correctly if engines exist", () => {
    cy.intercept(ENDPOINTS.ENGINES, { fixture: "engines-get.json" }).as(
      "getEngines",
    );
    cy.visit(ROUTES.HOMEPAGE);

    cy.findByRole("heading", { name: /giggle/i }).should("be.visible");
    cy.wait("@getEngines").then(({ response }) => {
      const firstEngine: DBTEngine = response?.body[0];

      cy.findByTestId("query-input").should("be.visible");
      cy.findByTestId("engines-button")
        .should("be.visible")
        .contains(firstEngine.name);
      cy.findByTestId("submit-button").should("exist");
    });
  });

  it("should redirect to engine manager if no engines exist", () => {
    cy.intercept(ENDPOINTS.ENGINES, []).as("getEngines");
    cy.visit(ROUTES.HOMEPAGE);

    cy.url().should("include", ROUTES.ENGINES);
  });
});
