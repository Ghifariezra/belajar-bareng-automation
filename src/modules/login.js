import assert from "assert";
import { By, until, Key } from "selenium-webdriver";
import { BasePage } from "../core/base.driver.js";

export class LoginPage extends BasePage {
    // Login Form Locator
    #formOverlayLocator = By.id("loginOverlay");
    #formTitleLocator = By.css("#loginOverlay .loginBox h3");

    #hintButtonLocator = By.css("button[data-testid='hint-button']");
    #hintUsernameLocator = By.id("hintUser");
    #hintPasswordLocator = By.id("hintPass");

    #usernameInputLocator = By.css("input[data-testid='username-input']");
    #passwordInputLocator = By.css("input[data-testid='password-input']");
    #loginButtonLocator = By.css("button[data-testid='login-button']");

    constructor(driver, folderName) {
        super(driver, folderName);
    }

    async open(url, title) {
        await super.open(url);

        try {
            const pageTitle = await this.driver.getTitle();
            assert.strictEqual(
                pageTitle,
                title,
                `Expected title to be '${title}' but got '${pageTitle}'`
            );

            const currentUrl = await this.driver.getCurrentUrl();
            assert.strictEqual(currentUrl, url, `Expected URL to be '${url}' but got '${currentUrl}'`);

            const loginForm = await this.driver.wait(
                until.elementLocated(By.css("form")),
                3000,
                "Login form element not found"
            );
            assert.ok(await loginForm.isDisplayed(), "Login form is not displayed");

            await super.takeScreenshot(
                await this.driver.takeScreenshot(),
                "login",
                "login_page_success.png"
            );
        } catch (error) {
            if (error instanceof assert.AssertionError) {
                await super.takeScreenshot(
                    await this.driver.takeScreenshot(),
                    "login/bugs",
                    `login_page_error_${error.expected || 'assertion'}.png`
                );
            }
            throw error;
        }
    }

    async loginForm({ username, password }, type) {
        let formTitle;

        try {
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

            formTitle = await this.driver.findElement(this.#formTitleLocator);
            
            // Typo: "Sing in" expected but got "Sign in"
            const expectedFormTitleText = "Sing in";

            const formTitleText = await formTitle.getText();
            assert.strictEqual(
                formTitleText,
                expectedFormTitleText,
                "Form title does not match expected value"
            );

            switch (type) {
                case "empty":
                    username = username || "";
                    password = password || "";
                    break;
                case "missing":
                    username = username || "admin";
                    password = password || "";
                    break;
                case "invalid":
                    username = username || "admin";
                    password = password || "invalid";
                    break;
                case "valid":
                    const hintData = await this.#getHintData();

                    assert.ok(hintData.username, "Hint username is missing");
                    assert.ok(hintData.password, "Hint password is missing");

                    const cleanUsername = this.#cleanCredential(hintData.username);
                    const cleanPassword = this.#cleanCredential(hintData.password);

                    assert.strictEqual(
                        username,
                        cleanUsername,
                        `Expected username to be '${hintData.username}' but got '${cleanUsername}'`
                    );
                    assert.strictEqual(
                        password,
                        cleanPassword,
                        `Expected password to be '${hintData.password}' but got '${cleanPassword}'`
                    );

                    username = cleanUsername;
                    password = cleanPassword;
                    break;
            }

            const usernameInput = await this.driver.findElement(this.#usernameInputLocator);
            const passwordInput = await this.driver.findElement(this.#passwordInputLocator);

            const requiredValidationMessage = "Please fill out this field.";
            switch (type) {
                case "empty":
                    await this.#emptyLogin(
                        { username, password },
                        formTitle,
                        usernameInput, 
                        passwordInput, 
                        requiredValidationMessage
                    );
                    break;
                case "missing":
                    await this.#missingLogin(
                        { username },
                        formTitle,
                        usernameInput, 
                        passwordInput, 
                        requiredValidationMessage
                    )
                    break;
                case "invalid":
                    await this.#invalidLogin(
                        { username, password },
                        usernameInput, 
                        passwordInput, 
                    );
                    break;
                case "valid":
                    await this.#validLogin(
                        { username, password },
                        usernameInput, 
                        passwordInput, 
                    );
                    break;
            }
        } catch (error) {
            let imageToSave;

            if (formTitle) {
                imageToSave = await formTitle.findElement(By.xpath("..")).takeScreenshot();
            } else {
                imageToSave = await this.driver.takeScreenshot();
            }

            if (error instanceof assert.AssertionError) {
                await super.takeScreenshot(
                    imageToSave,
                    `login/bugs/${error.expected}`,
                    `login_bug_${type || 'unknown'}_${error.expected}.png`
                );
            } else {
                await super.takeScreenshot(
                    imageToSave,
                    `login/errors/${error.message}`,
                    `login_error_${type || 'unknown'}_${error.message}.png`
                );
            }

            throw error;
        }
    }

    async goToUsersPage() {
        const loginButton = await this.driver.findElement(this.#loginButtonLocator);
        
        await loginButton.click();

        // Wait for 1 second to allow the validation message to appear
        await this.driver.sleep(1000);
    }

    async #emptyLogin({ username, password }, formTitle, usernameInput, passwordInput, requiredValidationMessage) {
        // Simulate empty input by sending empty strings to both username and password fields
        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password);
        await this.goToUsersPage();

        // Validate the validation messages for both username and password fields
        await usernameInput.getAttribute("validationMessage").then((message) => {
            assert.ok(message, "Expected validation message for empty username");
            assert.strictEqual(
                message,
                requiredValidationMessage,
                "Validation message for empty username does not match expected value"
            );
        });
        await passwordInput.getAttribute("validationMessage").then((message) => {
            assert.ok(message, "Expected validation message for empty password");
            assert.strictEqual(
                message,
                requiredValidationMessage,
                "Validation message for empty password does not match expected value"
            );
        });

        // Take a screenshot of the form overlay after validation
        await super.takeScreenshot(
            await formTitle.findElement(By.xpath("..")).takeScreenshot(),
            "login",
            "login_form_empty.png"
        );
    }
    async #missingLogin({ username }, formTitle, usernameInput, passwordInput, requiredValidationMessage) {
        await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
        await passwordInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

        await usernameInput.sendKeys(username);
        await this.goToUsersPage();

        await passwordInput.getAttribute("validationMessage").then((message) => {
            assert.ok(message, "Expected validation message for missing password");
            assert.strictEqual(
                message,
                requiredValidationMessage,
                "Validation message for missing password does not match expected value"
            );
        });

        await super.takeScreenshot(
            await formTitle.findElement(By.xpath("..")).takeScreenshot(),
            "login",
            "login_form_missing.png"
        );
    }
    async #invalidLogin({username, password}, usernameInput, passwordInput, ) {
        await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
        await passwordInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password);
        await this.goToUsersPage();

        await this.toastElement(
            "Invalid username or password!",
            async (toastContainer) => {
                await super.takeScreenshot(
                    await toastContainer.takeScreenshot(),
                    "login",
                    "login_form_invalid.png"
                );
            }
        );
    }
    async #validLogin({username, password}, usernameInput, passwordInput, ) {
        await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
        await passwordInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password);
    }

    #cleanCredential(value) {
        if (!value) return "";
        return value.includes(":") ? value.split(":")[1].trim() : value.trim();
    }

    async #getHintData() {
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