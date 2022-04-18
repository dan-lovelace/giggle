import fs from "fs";
import { Page } from "puppeteer";

export const PUPPETEER_DIRECTORIES = Object.freeze({
  ROOT: "puppeteer",
  BROWSER_DATA: "puppeteer/browserData",
  SCREENSHOTS: "puppeteer/screenshots",
});

function initDirectories(): void {
  Object.keys(PUPPETEER_DIRECTORIES).forEach((key) => {
    const dir = PUPPETEER_DIRECTORIES[key];

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
}

export async function takeScreenshot(page: Page): Promise<string | Buffer> {
  return page.screenshot({
    path: `${PUPPETEER_DIRECTORIES.SCREENSHOTS}/${new Date().getTime()}.png`,
    fullPage: true,
  });
}

initDirectories();
