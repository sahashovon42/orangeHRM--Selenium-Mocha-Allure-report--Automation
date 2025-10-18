// utils/driver.js
import { Browser, Builder } from "selenium-webdriver";

export async function buildDriver() {
  // Only Safari setup (macOS)
  const driver = await new Builder().forBrowser(Browser.SAFARI).build();
  await driver.manage().window().maximize();
  return driver;
}
