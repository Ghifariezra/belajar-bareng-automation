import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import * as firefox from "selenium-webdriver/firefox.js";
import * as edge from "selenium-webdriver/edge.js";
import { BelajarBareng } from "../../src/belajar.bareng.js";
import { before, after, describe } from "mocha";
import { LoginTest, AddUsersTest, CheckoutTest } from "./modules/index.test.js";

export class BelajarBarengTest {
    constructor(testContext, browser, options) {
        // Initialize the test context and browser
        this.testContext = testContext;
        this.browser = browser;
        this.options = options;

        // Initialize the test modules
        this.LoginTest = new LoginTest(testContext);
        this.AddUsersTest = new AddUsersTest(testContext);
        this.CheckoutTest = new CheckoutTest(testContext);
    }

    run() {
        // Destructure the testContext, browser, options, LoginTest, AddUsersTest, and CheckoutTest from the instance for easier access
        const { testContext, browser, options, LoginTest, AddUsersTest, CheckoutTest } = this;

        describe(`Belajar Bareng Automation - [${browser.toUpperCase()}]`, function () {
            before(async function () {
                testContext.title = "User Management";
                testContext.baseUrl = "https://belajar-bareng.onrender.com";

                testContext.driver = await new Builder()
                    .forBrowser(browser)
                    .setChromeOptions(options instanceof chrome.Options ? options : undefined)
                    .setFirefoxOptions(options instanceof firefox.Options ? options : undefined)
                    .setEdgeOptions(options instanceof edge.Options ? options : undefined)
                    .build();

                testContext.belajarBareng = new BelajarBareng(
                    testContext.driver,
                    "belajar-bareng",
                    browser
                );
            });

            after(async function () {
                if (testContext.belajarBareng && testContext.belajarBareng.driver) {
                    await testContext.belajarBareng.driver.quit();
                }
            });

            // Panggil run() dari instance class yang sudah di-destructure
            LoginTest.run();
            AddUsersTest.run();

            /*
                NOTED: 
                this test is skipped because the checkout process unstable when running on Firefox. 
                for case when user been checkout then the confirmation modal that details data can suddenly is empty. 
                but when running on Chrome it works fine. so for now this test is skipped until the issue can be fixed.
            */
            CheckoutTest.run();
        });
    }
}