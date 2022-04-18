/// <reference types="cypress" />

import { ENDPOINTS } from "../../lib/endpoints";
import enginesJson from "../fixtures/engines.json";

const enginesMock = JSON.parse(JSON.stringify(enginesJson));

describe("Homepage", () => {
  it("should load and display search form", () => {
    cy.intercept(ENDPOINTS.ENGINES, { fixture: "engines.json" }).as("engines");
    cy.visit("/");
    cy.findByRole("heading", { name: /giggle/i }).should("be.visible");
    cy.findByTestId("query-input").should("be.visible");
    cy.findByTestId("engines-button").should("be.visible");
    cy.findByTestId("submit-button").should("exist");
  });

  it("should show an error if no engines exist", () => {
    cy.intercept(ENDPOINTS.ENGINES, []).as("engines");
    cy.visit("/");
    cy.findByText(/no engines found/i).should("be.visible");
  });

  it("should show an alert if puppeteer login fails", () => {
    cy.intercept(ENDPOINTS.ENGINES, {
      body: { error: "Lorem ipsum" },
      statusCode: 500,
    }).as("engines");
    cy.visit("/");
    cy.findByRole("alert").should("be.visible");
    cy.findByText(/no engines found/i);
  });
});
