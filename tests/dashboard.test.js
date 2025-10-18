//Dashboard
// Journey path: Login → Dashboard

import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { buildDriver } from "../utils/driver.js";
import fs from "fs";
import { sleep } from "../utils/helpers.js";
//import credentials from "../utils/credentials.json" assert { type: "json" };
import path from "path";
const credentialsPath = path.resolve("utils/credentials.json");
const credentialsData = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

describe("OrangeHRM - Dashboard tests", function () {
  this.timeout(60000); // mocha timeout

  let driver;
  //https://opensource-demo.orangehrmlive.com/
  const baseUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
  beforeEach(async () => {
    driver = await buildDriver();
    await driver.manage().window().maximize();
  });

  afterEach(async function () {
    // If test failed, take screenshot and attach to allure results
    if (this.currentTest.state === "failed") {
      try {
        const screenshot = await driver.takeScreenshot(); // base64
        // write file to allure-results for attachment
        const fileName = `allure-results/screenshot-${Date.now()}.png`;
        fs.writeFileSync(fileName, screenshot, "base64");
        // If allure-mocha's global 'allure' exists, attach it
        try {
          // eslint-disable-next-line no-undef
          if (typeof allure !== "undefined" && allure) {
            // Read file buffer and attach
            const buffer = fs.readFileSync(fileName);
            // Add attachment (Allure)
            allure.addAttachment("screenshot", buffer, "image/png");
          }
        } catch (err) {
          // ignore if allure global is not available
        }
      } catch (e) {
        console.error("Error while saving screenshot:", e);
      }
    }

    if (driver) {
      await driver.quit();
    }
  });


  //______________Ensure dashboard widgets________________//

  it("Should have widgets (like “Time at Work”, “My Actions”, “Quick Launch”) ", async () => {
    await driver.get(baseUrl);

    //username
    const usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@name='username']")),10000);
    await usernameInput.sendKeys(credentialsData.user_pass.USER);
    await sleep(2000);


    //password
    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys(credentialsData.user_pass.PASS);
    await sleep(2000);

    //login button
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    //await sleep(5000);

    // wait until URL changes or a dashboard element appears
    await driver.wait(until.elementLocated(By.xpath("//a[@href='/web/index.php/dashboard/index']")),10000);

    const Time_at_Work = "Time at Work";
    const My_Actions = "My Actions";
    const Quick_Launch = "Quick Launch";
    const actual_Time_at_Work = await driver.findElement(By.xpath("(//div[contains(@class,'orangehrm-dashboard-widget-name')])[1]")).getText(); //Time at Work
    const actual_My_Actions = await driver.findElement(By.xpath("(//div[contains(@class,'orangehrm-dashboard-widget-name')])[2]")).getText();
    const actual_Quick_Launch = await driver.findElement(By.xpath("(//div[contains(@class,'orangehrm-dashboard-widget-name')])[3]")).getText();


    expect(Time_at_Work).to.equal(actual_Time_at_Work);
    expect(My_Actions).to.equal(actual_My_Actions);
    expect(Quick_Launch).to.equal(actual_Quick_Launch);

  });



  //________________Verify user profile expected options________________//

  it("Verify user profile dropdown (top-right) contains expected options.", async () => {
    await driver.get(baseUrl);

    //username
    const usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@name='username']")),10000);
    await usernameInput.sendKeys(credentialsData.user_pass.USER);
    await sleep(2000);


    //password
    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys(credentialsData.user_pass.PASS);
    await sleep(2000);

    //login button
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    //await sleep(5000);

    // wait until URL changes or a dashboard element appears
    await driver.wait(until.elementLocated(By.xpath("//a[@href='/web/index.php/dashboard/index']")),10000);

    //log out button
    await driver.findElement(By.xpath("//span[contains(@class,'oxd-userdropdown-tab')]")).click();//click profile
    await sleep(2000);

    const menu_list = await driver.findElements(By.xpath("//ul[@role='menu']/li"));
    console.log(`\nTotal ${menu_list.length} options found`);

    for (let i = 0; i < menu_list.length; i++) {
      const text = await menu_list[i].getText();
      console.log(`${i+1}. ${text}`);
    }
    
    const totalOption = 4;
    expect(totalOption).to.equal(menu_list.length);

  });


});