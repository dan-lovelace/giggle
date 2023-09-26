import path from "path";

import { Knex } from "knex";

const cwd = process.cwd();
const defaultConfig: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: path.join(
      cwd,
      path.basename(cwd) === "db" ? "" : "../db",
      "db.sqlite3",
    ),
  },
  migrations: {
    extension: "ts",
  },
  useNullAsDefault: true,
};

const config: { [key: string]: Knex.Config } = {
  development: defaultConfig,
  production: defaultConfig,
};

module.exports = config;
