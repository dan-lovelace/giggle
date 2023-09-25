/// <reference types="cypress" />

import { apiTypeLabelMap, DBTEngine } from "@giggle/types";

import { ENDPOINTS } from "../../src/lib/endpoints";
import { ROUTES } from "../../src/lib/routes";

describe("engines page", () => {
  it("should render correctly if engines exist", () => {
    cy.intercept(ENDPOINTS.ENGINES, { fixture: "engines-get.json" }).as(
      "enginesGet",
    );
    cy.visit(ROUTES.ENGINES);

    cy.wait("@enginesGet").then(({ response }) => {
      cy.findByTestId("query-input").should("be.visible");
      cy.findByRole("heading", { name: /search engines/i }).should(
        "be.visible",
      );
      cy.findByTestId("engines-list")
        .should("be.visible")
        .within(() => {
          cy.findAllByTestId("engine-item").then((items) => {
            expect(items.length).to.equal(response?.body.length);

            cy.wrap(items).each((item, idx) => {
              const engine: DBTEngine = response?.body[idx];

              cy.wrap(item).contains(engine.name);
              cy.wrap(item).contains(engine.identifier);
              cy.wrap(item).contains(apiTypeLabelMap[engine.api_type]);
              cy.wrap(item)
                .findByTestId("edit-engine-button")
                .should("be.visible");
              cy.wrap(item)
                .findByTestId("delete-engine-button")
                .should("be.visible");
            });
          });
        });
      cy.findByTestId("add-engine-button").should("be.visible");
    });
  });

  it("should not display the search form if no engines exist", () => {
    cy.intercept(ENDPOINTS.ENGINES, []).as("enginesGet");
    cy.visit(ROUTES.ENGINES);

    cy.findByTestId("query-input").should("not.exist");
    cy.contains(/no engines/i);
    cy.findByTestId("add-engine-button").should("be.visible");
  });

  // TODO
  // it("should handle engine editing", () => {
  //   cy.intercept("GET", ENDPOINTS.ENGINES, { fixture: "engines-get.json" }).as(
  //     "enginesGet",
  //   );
  //   cy.intercept("PUT", ENDPOINTS.ENGINES, { fixture: "engines-put.json" }).as(
  //     "enginesPut",
  //   );

  //   cy.visit(ROUTES.ENGINES);

  //   cy.wait("@enginesGet").then(({ response }) => {
  //     cy.findAllByTestId("engine-item").then((items) => {
  //       const firstEngine: DBTEngine = response?.body[0];

  //       cy.wrap(items[0]).within(() => {
  //         cy.findByTestId("edit-engine-button").click();
  //         cy.findByTestId("save-engine-button").should("be.visible");

  //         // initial values
  //         cy.get("input[name='name']").should("have.value", firstEngine.name);
  //         cy.get("input[name='identifier']").should(
  //           "have.value",
  //           firstEngine.identifier,
  //         );
  //         cy.get("input[name='api_type']").should(
  //           "have.value",
  //           firstEngine.api_type,
  //         );

  //         // changing values
  //       });
  //     });
  //   });
  // });
});
