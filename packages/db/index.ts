import knex from "knex";

import * as config from "./knexfile";

export const connection = () =>
  knex(config[process.env.NODE_ENV || "development"]);
