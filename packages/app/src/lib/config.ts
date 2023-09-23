import { TAppConfig } from "@giggle/types";
import dotenv from "dotenv";

dotenv.config();

export const config: TAppConfig = {
  googleApiKey: process.env.GOOGLE_API_KEY,
  resultsCacheLengthSeconds: process.env.RESULTS_CACHE_LENGTH_SECONDS,
};
