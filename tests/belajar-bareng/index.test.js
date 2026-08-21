import { Builder } from "selenium-webdriver";
import { BelajarBareng } from "../../src/belajar.bareng.js";
import { before, after, describe } from "mocha";
import { LoginTest, AddUsersTest, CheckoutTest } from "./modules/index.test.js";

const BROWSER = process.env.BROWSER || "chrome";

describe(`Belajar Bareng Automation - [${BROWSER.toUpperCase()}]`, function () {
    const testContext = {};

    before(async function () {
        testContext.title = "User Management";
        testContext.baseUrl = "https://belajar-bareng.onrender.com";

        testContext.driver = await new Builder().forBrowser(BROWSER).build();
        testContext.belajarBareng = new BelajarBareng(testContext.driver, "belajar-bareng", BROWSER);
    });

    after(async function () {
        if (testContext.belajarBareng && testContext.belajarBareng.driver) {
            await testContext.belajarBareng.driver.quit();
        }
    });

    new LoginTest(testContext).run();
    new AddUsersTest(testContext).run();

    /*
        NOTED: 
        this test is skipped because the checkout process unstable when running on Firefox. for case when user been checkout then the confirmation modal that details data can suddenly is empty. but when running on Chrome it works fine. so for now this test is skipped until the issue can be fixed.
    */
    new CheckoutTest(testContext).run();
});