import dotenv from "dotenv";

import { TAppConfig } from "../types/common";

dotenv.config();

export const config: TAppConfig = {
  googleApiKey: process.env.GOOGLE_API_KEY,
  googlePassword: process.env.GOOGLE_PASSWORD,
  googleUsername: process.env.GOOGLE_USERNAME,
  resultsCacheLengthSeconds: process.env.RESULTS_CACHE_LENGTH_SECONDS,
};
