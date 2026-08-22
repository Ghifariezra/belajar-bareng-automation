import assert from "assert";
import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import * as firefox from "selenium-webdriver/firefox.js";
import * as edge from "selenium-webdriver/edge.js";
import { before, after, describe } from "mocha";
import { BelajarBareng } from "../../src/belajar.bareng.js";
import { runLoginTests, runDashboardTests, runCheckoutTests } from "./modules/index.test.js";

async function buildDriver(browser, options) {
    const builder = new Builder().forBrowser(browser);

    if (options instanceof chrome.Options) builder.setChromeOptions(options);
    if (options instanceof firefox.Options) builder.setFirefoxOptions(options);
    if (options instanceof edge.Options) builder.setEdgeOptions(options);

    return await builder.build();
}

async function setupTestContext(testContext, browser, options) {
    testContext.title = "User Management";
    testContext.baseUrl = new URL("https://belajar-bareng.onrender.com");
    testContext.driver = await buildDriver(browser, options);

    const belajarBareng = new BelajarBareng(
        testContext.driver,
        "belajar-bareng",
        browser
    );

    assert.ok(
        belajarBareng instanceof BelajarBareng,
        "Failed to initialize BelajarBareng instance"
    );
    assert.ok(
        belajarBareng.login && belajarBareng.dashboard && belajarBareng.checkout,
        "Failed to initialize page objects in BelajarBareng"
    );

    testContext.belajarBareng = belajarBareng;

    await testContext.belajarBareng.open(testContext.baseUrl);
}

async function teardownTestContext(testContext) {
    const driver = testContext.belajarBareng?.driver;
    if (driver) {
        await driver.quit();
    }
}

export function runBelajarBarengTests(browser, options) {
    const testContext = {};

    describe(`Belajar Bareng Automation - [${browser.toUpperCase()}]`, function () {
        before(async function () {
            await setupTestContext(testContext, browser, options);
        });

        after(async function () {
            await teardownTestContext(testContext);
        });

        runLoginTests(testContext);
        runDashboardTests(testContext);
        runCheckoutTests(testContext);
    });
}