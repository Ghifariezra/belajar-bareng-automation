import { By, Key, until } from "selenium-webdriver";
import { BasePage } from "../core/base.driver.js";

export class LoginPage extends BasePage {
    // Login Form Locator
    #formOverlayLocator = By.id("loginOverlay");
    #formBoxLocator = By.css("#loginOverlay .loginBox");
    #formTitleLocator = By.css("#loginOverlay .loginBox h3");

    #hintButtonLocator = By.css("button[data-testid='hint-button']");
    #hintUsernameLocator = By.id("hintUser");
    #hintPasswordLocator = By.id("hintPass");

    #usernameInputLocator = By.css("input[data-testid='username-input']");
    #passwordInputLocator = By.css("input[data-testid='password-input']");
    #loginButtonLocator = By.css("button[data-testid='login-button']");

    constructor(driver, folderName, browser) {
        super(driver, folderName, browser);
    }

    async #getUsernameInput() {
        return await this.driver.findElement(this.#usernameInputLocator);
    }
    async #getPasswordInput() {
        return await this.driver.findElement(this.#passwordInputLocator);
    }

    async getFormData() {
        const pageTitle = await this.driver.getTitle();
        const currentUrl = await this.driver.getCurrentUrl();

        const formOverlay = await this.driver.wait(
            until.elementLocated(this.#formOverlayLocator),
            3000,
            "Expected login form overlay to be present"
        );
        await this.driver.wait(
            until.elementIsVisible(formOverlay),
            3000,
            "Expected login form overlay to be visible"
        );

        const formTitle = await this.driver.findElement(this.#formTitleLocator).getText();

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
        const loginButton = await this.driver.findElement(this.#loginButtonLocator);
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
        const formBoxElement = await this.driver.findElement(this.#formBoxLocator);
        const screenshot = await formBoxElement.takeScreenshot();
        await super.takeScreenshot(screenshot, folderPath, filename);
    }

    cleanCredential(value) {
        if (!value) return "";
        return value.includes(":") ? value.split(":")[1].trim() : value.trim();
    }

    async getHintData() {
        const hintButton = await this.driver.wait(
            until.elementLocated(this.#hintButtonLocator),
            3000,
            "Hint button not found"
        );
        await hintButton.click();

        const usernameHint = await this.driver.wait(
            until.elementLocated(this.#hintUsernameLocator),
            3000
        );
        const passwordHint = await this.driver.findElement(this.#hintPasswordLocator);

        return {
            username: await usernameHint.getText(),
            password: await passwordHint.getText(),
        };
    }
}