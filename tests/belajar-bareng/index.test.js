import { Builder } from "selenium-webdriver";
import { BelajarBareng } from "../../src/belajar.bareng.js";
import assert from "assert";
import { before, after, describe, it } from "mocha";

// Import Class yang baru dibuat
import { LoginTest } from "./modules/login.test.js";
import { AddUsersTest } from "./modules/add.users.test.js";

describe("Belajar Bareng Automation", function () {
    // Context global
    const testContext = {};

    before(async function () {
        // 2. fill testContext
        testContext.title = "User Management";
        testContext.baseUrl = "https://belajar-bareng.onrender.com/";
        testContext.driver = await new Builder().forBrowser("chrome").build();
        testContext.belajarBareng = new BelajarBareng(testContext.driver, "belajar-bareng");
    });

    after(async function () {
        if (testContext.belajarBareng && testContext.belajarBareng.driver) {
            setTimeout(async () => {
                await testContext.belajarBareng.driver.quit();
            }, 5000);
        }
    });

    // it.skip("Should open the base URL successfully", async function () {
    //     await testContext.belajarBareng.loginPage.open(testContext.baseUrl);
    // });

    // 3. Run the test classes
    new LoginTest(testContext).run();
    // new AddUsersTest(testContext).run();
});