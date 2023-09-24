import { TApiType } from "@giggle/types";

export const apiTypeLabelMap: Record<TApiType, string> = {
  DEFAULT: "Default",
  SITE_RESTRICTED: "Site Restricted",
};

export { default as EnginesPage } from "./EnginesPage";
