/**
 * These types are mapped to match the database schema.
 */

import { TApiType } from ".";

export type DBTEngine = {
  api_type: TApiType;
  identifier: string;
  name: string;
};
