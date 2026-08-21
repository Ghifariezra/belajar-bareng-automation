import assert from "assert";
import { By, until } from "selenium-webdriver";
import { BaseScreenshot } from "./base.screenshot.js";

export class BasePage extends BaseScreenshot {
    #toastContentLocator = By.css("[data-testid='toast-content']");

    constructor(driver, folderName, browser) {
        super(folderName, browser);
        this.driver = driver;
    }

    async toastElement(expectedText, callbackScreenshot) {
        // 1. wait until the toast message appears
        const toastContent = await this.driver.wait(
            until.elementLocated(this.#toastContentLocator),
            5000,
            "Expected toast message to appear"
        );

        // 2. wait until the toast message is visible
        await this.driver.wait(
            until.elementIsVisible(toastContent),
            5000,
            "Expected toast message to be visible"
        );

        // 3. validate the toast message
        const actualText = await toastContent.getText();
        assert.strictEqual(
            actualText,
            expectedText,
            "Toast message does not match expected value"
        );

        // 4. get screenshot if callbackScreenshot is provided
        if (callbackScreenshot) {
            await callbackScreenshot(toastContent);
        }

        // 5. wait until the toast message disappears
        await this.driver.wait(
            until.stalenessOf(toastContent),
            5000,
            "Expected toast message to disappear automatically"
        );
    }

    async open(url) {
        await this.driver.get(url);
    }

    async quit() {
        if (this.driver) {
            await this.driver.quit();
        }
    }
}