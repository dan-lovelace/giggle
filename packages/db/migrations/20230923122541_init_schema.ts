import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("engine", (table) => {
    table.increments("id");
    table.string("name").notNullable().unique();
    table.string("identifier").notNullable().unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("engine");
}
