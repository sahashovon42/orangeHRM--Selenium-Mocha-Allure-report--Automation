//Login
// Journey path: Home (Login) → Dashboard → Logout

import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { buildDriver } from "../utils/driver.js";
import fs from "fs";
import { sleep } from "../utils/helpers.js";
//import credentials from "../utils/credentials.json" assert { type: "json" };
import path from "path";
const credentialsPath = path.resolve("utils/credentials.json");
const credentialsData = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));

describe("OrangeHRM - Login tests", function () {
  this.timeout(60000); // mocha timeout

  //credentials
  // const USER = "Admin";
  // const PASS = "admin123";

  let driver;
  //https://opensource-demo.orangehrmlive.com/
  const baseUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";
  const dashboardUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index";

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


  //_____________Login with valid credentials and reach Dashboard________//

  it("Should login with valid credentials and reach Dashboard", async () => {
    await driver.get(baseUrl);

    //username
    //await driver.findElement(By.xpath("//input[@name='username']")).sendKeys(credentialsData.user_pass.USER);
    const usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@name='username']")),10000);
    //await usernameInput.clear();
    await usernameInput.sendKeys(credentialsData.user_pass.USER);
    await sleep(2000);


    //password
    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys(credentialsData.user_pass.PASS);
    await sleep(2000);

    //login button
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    await sleep(5000);

    // wait until URL changes or a dashboard element appears
    await driver.wait(until.urlContains("/dashboard/index"), 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal(dashboardUrl);
  });


  //_____________Logout and back to login page____________//

  it("Should logout and back to login page", async () => {
    
    await driver.get(baseUrl);

    //username
    //await driver.findElement(By.xpath("//input[@name='username']")).sendKeys(credentialsData.user_pass.USER);
    const usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@name='username']")),10000);
    //await usernameInput.clear();
    await usernameInput.sendKeys(credentialsData.user_pass.USER);
    await sleep(2000);


    //password
    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys(credentialsData.user_pass.PASS);
    await sleep(2000);

    //login button
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    await sleep(2000);

    // wait until URL changes
    await driver.wait(until.urlContains("/dashboard/index"), 10000);


    //log out button
    await driver.findElement(By.xpath("//span[contains(@class,'oxd-userdropdown-tab')]")).click();//click profile
    await sleep(2000);
    await driver.findElement(By.xpath("//ul/li/a[@href='/web/index.php/auth/logout']")).click();//click log out

    // wait until URL changes
    //await driver.wait(until.urlContains("/auth/login"), 10000);
    await sleep(2000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.equal(baseUrl);
  });



  //______________Invalid credentials Error____________//

  it("Invalid credentials Error", async () => {
    await driver.get(baseUrl);

    const usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@name='username']")),10000);
    await usernameInput.sendKeys(credentialsData.invalid_user_pass.USER);
    await sleep(2000);

    await driver.findElement(By.xpath("//input[@type='password']")).sendKeys(credentialsData.invalid_user_pass.PASS);
    await sleep(2000);

    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    await sleep(5000);

    // check error message
    const actualError = "Invalid credentials";
    const extectedError = await driver.findElement(By.xpath("//p[contains(@class,'oxd-text oxd-text--p oxd-alert-content-text')]")).getText();
    expect(extectedError).to.equal(actualError);
    // //check any indalid message
    // const errorSelector = By.css(".oxd-alert-content-text");
    // const err = await driver.wait(until.elementLocated(errorSelector), 5000);
    // const text = await err.getText();
    // expect(text.toLowerCase()).to.satisfy((t) => t.includes("invalid") || t.includes("credentials") || t.length > 0);
  });


  //______________Empty credentials Error____________//

  it("Empty credentials Error", async () => {
    await driver.get(baseUrl);
    await sleep(2000);

    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    await sleep(3000);

    // Check error message
    const actualError = "Required";
    const extectedError = await driver.findElement(By.xpath("(//span[contains(@class,'oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message')])[1]")).getText();
    expect(extectedError).to.equal(actualError);


  });

});