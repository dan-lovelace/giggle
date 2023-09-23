import knex from "knex";

import * as config from "./knexfile";

export const connection = () => knex(config["development"]);
