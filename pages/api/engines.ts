import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { config } from "../../lib/config";
import { PUPPETEER_DIRECTORIES, takeScreenshot } from "../../lib/puppeteer";
import { TSearchEngine } from "../../types/common";

puppeteer.use(StealthPlugin());

const launchConfig = {
  headless: true,
  userDataDir: PUPPETEER_DIRECTORIES.BROWSER_DATA,
};

function getEngines() {
  return new Promise<TSearchEngine[] | Error | void>((resolve, reject) => {
    puppeteer.launch(launchConfig).then(async (browser) => {
      const page = await browser.newPage();

      try {
        await page.setDefaultNavigationTimeout(3000);
        await page.goto(
          "https://programmablesearchengine.google.com/smart_sign_in"
        );

        // login if necessary
        const usernameInputSelector = "input#identifierId";
        const passwordInputSelector = "input[type='password'][name='password']";
        const [usernameInput] = await page.$$(usernameInputSelector);
        if (usernameInput) {
          // NOTE: the timeout waits here aren't ideal but login will fail
          // sometimes without them because of google's form transitions,
          // especially with slow internet.
          await page.waitForTimeout(500);
          await page.click(usernameInputSelector);
          await page.keyboard.type(config.googleUsername);
          await page.keyboard.press("Enter");
          await page.waitForNavigation();
          await page.waitForTimeout(500);
          await page.click(passwordInputSelector);
          await page.keyboard.type(config.googlePassword);
          await page.keyboard.press("Enter");
          await page.waitForNavigation();
        }

        // find existing engines
        const titleContainerSelector = "tbody .allcse-title-col a";
        await page.waitForSelector(titleContainerSelector);
        const titleContainers = await page.$$(titleContainerSelector);
        const engines = await Promise.all(
          titleContainers.map(async (element) =>
            element.evaluate((el) => ({
              id: el.getAttribute("href").replace(/^.*=/, ""),
              name: el.textContent.trim(),
            }))
          )
        );

        await browser.close();
        resolve(engines);
      } catch (e) {
        console.error("Error getting engines:", e.message);
        await takeScreenshot(page);
        await browser.close();
        reject(e);
      }
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const result = await getEngines();
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send({ error });
      }
      break;

    default:
      res.status(405).end();
  }
}
