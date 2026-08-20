import assert from "assert";
import { By, until } from "selenium-webdriver";
import { BaseScreenshot } from "./base.screenshot.js";

export class BasePage extends BaseScreenshot {
    // Toast Locator
    #toastContainerLocator = "//div[@data-testid='Toastify__toast-container--top-right']";
    #toastAddUserLocator = "//div[@data-testid='toast-content']";

    constructor(driver, folderName) {
        super(folderName);
        this.driver = driver;
    }

    async toastElement(expectedText, callbackScreenshot) {
        // Validate toast message after adding user
        await this.driver.wait(
            until.elementLocated(By.xpath(this.#toastContainerLocator)),
            3000, // Wait for up to 3 seconds for the toast message to appear
            "Expected toast message to appear after adding user"
        );

        await this.driver.wait(
            until.elementIsVisible(await this.driver.findElement(By.xpath(this.#toastContainerLocator))),
            3000,
            "Expected toast message to be visible"
        );

        assert.ok(
            await this.driver.findElement(By.xpath(this.#toastContainerLocator)).isDisplayed(),
            "Toast message is not displayed after adding user"
        );


        const toastContainer = await this.driver.findElement(
            By.xpath(this.#toastContainerLocator)
        );

        await this.driver.wait(
            until.elementLocated(By.xpath(this.#toastAddUserLocator)),
            3000, // Wait for up to 3 seconds for the toast message to appear
            "Expected toast message to appear after adding user"
        );

        await this.driver.wait(
            until.elementIsVisible(await this.driver.findElement(By.xpath(this.#toastAddUserLocator))),
            3000,
            "Expected toast message to be visible"
        );

        assert.ok(
            await this.driver.findElement(By.xpath(this.#toastAddUserLocator)).isDisplayed(),
            "Toast message is not displayed after adding user"
        );

        // Validate the text of the toast message
        // toastAddUserText found BUG -> when user input username like "Quiz User" toastAddUserText return "QuizUser" without space, so I will trim the text and compare it with expected value
        const toastAddUser = await toastContainer.findElement(
            By.xpath(this.#toastAddUserLocator)
        );
        const toastAddUserText = await toastAddUser.getText();
        assert.strictEqual(
            toastAddUserText,
            expectedText,
            "Toast message does not match expected value"
        );

        if (callbackScreenshot) {
            await callbackScreenshot(toastContainer);
        }

        await this.driver.wait(
            until.stalenessOf(toastContainer),
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