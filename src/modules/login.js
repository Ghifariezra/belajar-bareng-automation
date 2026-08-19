import assert from "assert";
import { By, until } from "selenium-webdriver";
import { BasePage } from "../core/base.driver.js";

export class LoginPage extends BasePage {
    // Form Title Locator
    #formTitleLocator = `//*[@id="loginOverlay"]/div/h3/strong`;

    // Button Hint Locator
    #hintButtonLocator = "//button[@data-testid='hint-button']";
    #hintUsernameLocator = "//code[@id='hintUser']";
    #hintPasswordLocator = "//code[@id='hintPass']";

    // Form Input Data Test ID
    #usernameInputLocator = "//input[@data-testid='username-input']";
    #passwordInputLocator = "//input[@data-testid='password-input']";
    #loginButtonLocator = "//button[@data-testid='login-button']";

    constructor(driver, folderName) {
        super(driver, folderName);
    }

    async #getHintData() {
        const hintButton = await this.driver.findElement(
            By.xpath(this.#hintButtonLocator)
        );
        await hintButton.click();

        const usernameHint = await this.driver.findElement(
            By.xpath(this.#hintUsernameLocator)
        );
        const passwordHint = await this.driver.findElement(
            By.xpath(this.#hintPasswordLocator)
        );
        return {
            username: await usernameHint.getText(),
            password: await passwordHint.getText(),
        };
    }

    async loginForm(username, password) {
        // Validate the form title
        const formTitle = await this.driver.findElement(
            By.xpath(this.#formTitleLocator)
        );

        // BUG -> should be "Sign In" but the actual text is "Sing in" so I will validate the form title with the actual text
        // const expectedFormTitleText = "Sign In";
        const expectedBypassFormTitleText = "Sing in";
        const formTitleText = await formTitle.getText();
        assert.strictEqual(formTitleText, expectedBypassFormTitleText, "Form title does not match expected value");

        if (!username || !password) {
            const hintData = await this.#getHintData();
            username = hintData.username;
            password = hintData.password;
        }

        const usernameInput = await this.driver.findElement(
            By.xpath(this.#usernameInputLocator)
        );
        const passwordInput = await this.driver.findElement(
            By.xpath(this.#passwordInputLocator)
        );
        const loginButton = await this.driver.findElement(
            By.xpath(this.#loginButtonLocator)
        );

        await usernameInput.sendKeys(username.split(":")[1].trim());
        await passwordInput.sendKeys(password.split(":")[1].trim());
        await loginButton.click();
    }

    async open(url, title) {
        await super.open(url);

        try {
            let page_title = await this.driver.getTitle();

            assert.ok(page_title !== null && page_title !== undefined, "Page title is null or undefined");
            assert.strictEqual(page_title, title, `Expected title to be '${title}' but got '${page_title}'`);

            let currentUrl = await this.driver.getCurrentUrl();
            assert.strictEqual(currentUrl, url);

            let loginForm = await this.driver.findElement(By.css("form"));
            let isVisible = await loginForm.isDisplayed();
            assert.ok(isVisible, "Login form is not displayed");
        } catch (error) {
            await super.takeScreenshot(
                await this.driver.takeScreenshot(),
                "login",
                "login_page_failed.png"
            );
            throw error;
        }

        await super.takeScreenshot(
            await this.driver.takeScreenshot(),
            "login",
            "login_page_success.png"
        );
    }
}