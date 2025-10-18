//Admin Module Tests
// Journey path: Login → Dashboard → Admin → Add/Search/Edit/Delete User → Logout

import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { buildDriver } from "../utils/driver.js";
import fs from "fs";
import { sleep } from "../utils/helpers.js";
import { getRandomNumber } from "../utils/randomNumber.js";
import { getRandomNumberMax } from "../utils/randomNumber.js";
import { generatePassword } from "../utils/password.js";
//import credentials from "../utils/credentials.json" assert { type: "json" };
import path from "path";
const credentialsPath = path.resolve("utils/credentials.json");
const credentialsData = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));



describe("OrangeHRM - Admin Module tests", function () {
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

      it("Verifing the table loads with users", async () => {
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

        //Wait until URL changes or a dashboard element appears
        await driver.wait(until.elementLocated(By.xpath("//a[@href='/web/index.php/dashboard/index']")),10000);
        await sleep(2000);

        //Admin click
        await driver.findElement(By.xpath("//a[@href='/web/index.php/admin/viewAdminModule']")).click();
        await driver.wait(until.elementLocated(By.xpath("(//span[@class='oxd-topbar-body-nav-tab-item'])[1]")),10000);
        await sleep(2000);

        //verify users exist
        const users = await driver.findElements(By.xpath("(//div[@role='rowgroup'])[2]/div"));
    //    //scroll the page
    //     driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    //     await sleep(2000);
        console.log(`\nTotal ${users.length} users found`);

        for (let i = 0; i < users.length; i++) {
          const text = await users[i].getText();
          console.log(`${i+1}. ${text}`);
        }

        const totalUser = await driver.findElement(By.xpath("//span[@class='oxd-text oxd-text--span']")).getText();
        const num = totalUser.replace(" (","",") Records Found"); // (17) Records Found
        const getNum = parseFloat(num);

        expect(users.length).to.equal(getNum);
      });



    //________________Add new user___________________//

    it("Add and verify new user", async () => {
        await driver.get(baseUrl);

        await sleep(3000);
        //username
        const usernameInput = await driver.wait(until.elementLocated(By.xpath("//input[@name='username']")), 10000);
        await usernameInput.sendKeys(credentialsData.user_pass.USER);
        await sleep(2000);

        //password
        await driver.findElement(By.xpath("//input[@type='password']")).sendKeys(credentialsData.user_pass.PASS);
        await sleep(1000);

        //login button
        await driver.findElement(By.xpath("//button[@type='submit']")).click();
        //await sleep(5000);

        //Wait until URL changes or a dashboard element appears
        await driver.wait(until.elementLocated(By.xpath("//a[@href='/web/index.php/dashboard/index']")), 10000);
        await sleep(1000);

        //Admin click
        await driver.findElement(By.xpath("//a[@href='/web/index.php/admin/viewAdminModule']")).click();
        await driver.wait(until.elementLocated(By.xpath("(//span[@class='oxd-topbar-body-nav-tab-item'])[1]")), 10000);
        //await sleep(2000);

        //Click add button
        await driver.findElement(By.xpath("//div[contains(@class,'orangehrm-header-container')]/button")).click();
        await driver.wait(until.elementLocated(By.xpath("(//span[@class='oxd-topbar-body-nav-tab-item'])[1]")), 10000);
        await sleep(3000);

        //_____form (add user)____//

        //user role
        await driver.findElement(By.xpath("(//div[contains(@class,'oxd-select-wrapper')])[1]")).click();
        await sleep(2000);

        const Role = await driver.findElements(By.xpath("//div[@role='listbox']/div"));
        const random_Role = getRandomNumber(1, Role.length);
        await Role[random_Role].click();

        const selected_Role = await driver.findElement(By.xpath("(//div[contains(@class,'oxd-select-wrapper')])[1]")).getText();
        console.log(`\nSelected role is ${selected_Role}`);


        //user Status
        await driver.findElement(By.xpath("(//div[contains(@class,'oxd-select-wrapper')])[2]")).click();
        await sleep(2000);

        const Status = await driver.findElements(By.xpath("//div[@role='listbox']/div"));
        const random_Status = getRandomNumber(1, Status.length);
        await Status[random_Status].click();

        const selected_Status = await driver.findElement(By.xpath("(//div[contains(@class,'oxd-select-wrapper')])[2]")).getText();
        console.log(`\nSelected Status is ${selected_Status}`);


        //__________name, username, password__________//
        //Employee Name
        const Ename = credentialsData.employeeName.name;
        const press_employee = Ename[getRandomNumber(0, Ename.length - 1)];
        await driver.findElement(By.xpath("//input[@placeholder='Type for hints...']")).sendKeys(press_employee);
        await sleep(5000); //wait for existing users

        const Employee = await driver.findElements(By.xpath("//div[@role='listbox']/div"));
        const random_Employee = getRandomNumber(0, Employee.length - 1);
        await Employee[random_Employee].click(); //click random user
        await sleep(2000);

        const nameBox = await driver.findElement(By.xpath("//input[@placeholder='Type for hints...']"));
        const selectedName = await nameBox.getAttribute("value"); //get the inner text
        console.log(`\nSelected  Employee is ${selectedName}`);


        //Username
        const textuser = selectedName.replace(/\s+/g, '').toLowerCase(); //remove spaces and make lowercase
        const cleanName = textuser.substring(0, 5);
        const randomUserNum = Math.floor(Math.random() * 9999) + 1; // random number between 1 and 999
        console.log(`\nGenerated username is ${cleanName}${randomUserNum}`);
        const newUsername = `${cleanName}${randomUserNum}`;


        await driver.findElement(By.xpath("(//input[contains(@class,'oxd-input oxd-input--active')])[2]")).sendKeys(newUsername);
        await sleep(3000);


        //password 
        const firstName = selectedName.split(" ")[0];

        const password = generatePassword(firstName);
        console.log("\nGenerated password:", password);

        // Set password and confirm password fields
        await driver.findElement(By.xpath("(//input[@type='password'])[1]")).sendKeys(password); //confirm Password
        await sleep(2000);

        await driver.findElement(By.xpath("(//input[@type='password'])[2]")).sendKeys(password); //confirm Password

        //Press Save to Add user
        const saveButton = await driver.findElement(By.xpath("//button[@type='submit']"));
        await saveButton.click();
        //await sleep(1000);
        //await driver.findElement(By.xpath("//button[@type='submit']")).click();

        //verify success message
        const toastLocator = By.css('.oxd-toast.oxd-toast--success');
        await driver.wait(until.elementLocated(toastLocator), 10000);
        const toast = await driver.findElement(toastLocator);
        const text = await toast.getText();
        const successMsg = text.replace("Success","").replace("×","").trim();// remove(×)remove the close icon. [trim()] remove spaces/newlines

        expect(successMsg).to.equal('Successfully Saved');

        //verify users exist
        // const users = await driver.findElements(By.xpath("(//div[@role='rowgroup'])[2]/div"));

        // console.log(`\nTotal ${users.length} users found`);

        // for (let i = 0; i < users.length; i++) {
        //     const text = await users[i].getText();
        //     console.log(`${i + 1}. ${text}`);
        // }

        // const totalUser = await driver.findElement(By.xpath("//span[@class='oxd-text oxd-text--span']")).getText();
        // const num = totalUser.replace(" (", "", ") Records Found"); // (17) Records Found
        // const getNum = parseFloat(num);

        // expect(users.length).to.equal(getNum);
    });


});
