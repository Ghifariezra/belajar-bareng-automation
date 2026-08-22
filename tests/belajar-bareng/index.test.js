import assert from "assert";
import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome.js";
import * as firefox from "selenium-webdriver/firefox.js";
import * as edge from "selenium-webdriver/edge.js";
import { BelajarBareng } from "../../src/belajar.bareng.js";
import { before, after, describe } from "mocha";
import { LoginTest, DashboardTest, CheckoutTest } from "./modules/index.test.js";

export class BelajarBarengTest {
    #testContext;
    #browser;
    #options;
    #modules;

    constructor(testContext, browser, options) {
        this.#testContext = testContext;
        this.#browser = browser;
        this.#options = options;

        this.#modules = [
            new LoginTest(testContext),
            new DashboardTest(testContext),
            new CheckoutTest(testContext),
        ];
    }

    run() {
        describe(`Belajar Bareng Automation - [${this.#browser.toUpperCase()}]`, () => {
            before(() => this.#setup());
            after(() => this.#teardown());

            this.#modules.forEach((module) => module.run());
        });
    }

    async #setup() {
        this.#testContext.title = "User Management";
        this.#testContext.baseUrl = new URL("https://belajar-bareng.onrender.com");
        this.#testContext.driver = await this.#buildDriver();

        const belajarBareng = new BelajarBareng(
            this.#testContext.driver,
            "belajar-bareng",
            this.#browser
        );

        assert.ok(
            belajarBareng instanceof BelajarBareng,
            "Failed to initialize BelajarBareng instance"
        )
        assert.ok(
            belajarBareng.login && belajarBareng.dashboard && belajarBareng.checkout,
            "Failed to initialize page objects in BelajarBareng"
        );

        this.#testContext.belajarBareng = belajarBareng;

        await this.#testContext.belajarBareng.open(this.#testContext.baseUrl);
    }

    async #teardown() {
        const driver = this.#testContext.belajarBareng?.driver;
        if (driver) {
            await driver.quit();
        }
    }

    async #buildDriver() {
        const builder = new Builder().forBrowser(this.#browser);

        if (this.#options instanceof chrome.Options) builder.setChromeOptions(this.#options);
        if (this.#options instanceof firefox.Options) builder.setFirefoxOptions(this.#options);
        if (this.#options instanceof edge.Options) builder.setEdgeOptions(this.#options);

        return await builder.build();
    }
}