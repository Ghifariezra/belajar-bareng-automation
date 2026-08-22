import { Key, until } from "selenium-webdriver";
import { BasePage } from "../core/base.driver.js";
import { LoginLocators } from "../locators/login.locator.js";

export class LoginPage extends BasePage {
    constructor(driver, folderName, browser) {
        super(driver, folderName, browser);
    }

    async #getUsernameInput() {
        return await this.driver.findElement(LoginLocators.usernameInput);
    }
    async #getPasswordInput() {
        return await this.driver.findElement(LoginLocators.passwordInput);
    }

    async getFormData() {
        const pageTitle = await this.driver.getTitle();
        const currentUrl = await this.driver.getCurrentUrl();

        const formOverlay = await this.driver.wait(
            until.elementLocated(LoginLocators.formOverlay),
            3000,
            "Expected login form overlay to be present"
        );
        await this.driver.wait(
            until.elementIsVisible(formOverlay),
            3000,
            "Expected login form overlay to be visible"
        );

        const formTitle = await this.driver.findElement(LoginLocators.formTitle).getText();

        return {
            pageTitle,
            currentUrl,
            formTitle,
        };
    }
    
    async login(username, password) {
        await this.inputCredentials(username, password);
        await this.goToUsersPage();
    }
    async inputCredentials(username, password) {
        const usernameInput = await this.#getUsernameInput();
        const passwordInput = await this.#getPasswordInput();

        if (username !== undefined && username !== null) {
            await usernameInput.sendKeys(username);
        }
        if (password !== undefined && password !== null) {
            await passwordInput.sendKeys(password);
        }
    }
    async clearFormInputs() {
        const usernameInput = await this.#getUsernameInput();
        const passwordInput = await this.#getPasswordInput();

        await usernameInput.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);
        await passwordInput.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);
    }
    async goToUsersPage() {
        const loginButton = await this.driver.findElement(LoginLocators.loginButton);
        await loginButton.click();

        await this.driver.sleep(1000); // Wait for 1 second to allow the page to load
    }
    async validateUsersPage(expectedUrl) {
        await this.driver.wait(
            until.urlContains(expectedUrl),
            5000,
            `Expected URL to contain '${expectedUrl}' after login`
        );

        return await this.driver.getCurrentUrl();
    }
    async getUsernameValidationMessage() {
        const usernameInput = await this.#getUsernameInput();
        return await usernameInput.getAttribute("validationMessage");
    }
    async getPasswordValidationMessage() {
        const passwordInput = await this.#getPasswordInput();
        return await passwordInput.getAttribute("validationMessage");
    }
    async getToastMessage(expectedMessage, filename) {
        await this.toastElement(expectedMessage, async (toastContainer) => {
            await super.takeScreenshot(
                await toastContainer.takeScreenshot(),
                "login",
                filename || "login_form_toast_message.png"
            );
        });
    }
    async takeScreenshotOfFormBox(folderPath, filename) {
        const formBoxElement = await this.driver.findElement(LoginLocators.formBox);
        const screenshot = await formBoxElement.takeScreenshot();
        await super.takeScreenshot(screenshot, folderPath, filename);
    }

    cleanCredential(value) {
        if (!value) return "";
        return value.includes(":") ? value.split(":")[1].trim() : value.trim();
    }

    async getHintData() {
        const hintButton = await this.driver.wait(
            until.elementLocated(LoginLocators.hintButton),
            3000,
            "Hint button not found"
        );
        await hintButton.click();

        const usernameHint = await this.driver.wait(
            until.elementLocated(LoginLocators.hintUsername),
            3000
        );
        const passwordHint = await this.driver.findElement(LoginLocators.hintPassword);

        return {
            username: await usernameHint.getText(),
            password: await passwordHint.getText(),
        };
    }
}