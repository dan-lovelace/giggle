import { TApiType } from "@giggle/types";
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const defaultApiType: TApiType = "DEFAULT";

  return knex.schema.createTable("engine", (table) => {
    table.increments("id");
    table.string("name").notNullable().unique();
    table.string("identifier").notNullable().unique();
    table.string("api_type").notNullable().defaultTo(defaultApiType);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("engine");
}
