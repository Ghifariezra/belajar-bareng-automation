import assert from "assert";
import { By, until, Key } from "selenium-webdriver";
import { BasePage } from "../core/base.driver.js";

export class DashboardPage extends BasePage {
    #expectedToastText;

    // Form Users Locator
    #formContainerLocator = "//div[@class='container']";
    #titleCardUsersLocator = `//*[@id="app"]/div/div/div/h2`;
    #buttonAddUserLocator = "//button[@data-testid='add-button']";

    // Form Add User Locator
    #titleCardAddUserLocator = `//*[@id="app"]/div/div/h2`;

    // Input Add User Locator
    #usernameInputLocator = "//input[@data-testid='username-input']";
    #ageInputLocator = "//input[@data-testid='age-input']";
    #buttonSubmitAddUserLocator = "//button[@data-testid='submit-button']";

    // Shop Page Locator
    #buttonShopLocator = '//button[@data-testid="shop-button"]';

    constructor(driver, folderName, browser) {
        super(driver, folderName, browser);
    }

    async goToAddUserPage() {
        // Validate title card on users page
        const titleCardUsers = await this.driver.findElement(
            By.xpath(this.#titleCardUsersLocator)
        );
        const titleCardUsersText = await titleCardUsers.getText();
        assert.strictEqual(
            titleCardUsersText,
            "List Users",
            "Title card does not match expected value"
        );

        const addUserButton = await this.driver.findElement(
            By.xpath(this.#buttonAddUserLocator)
        );
        await addUserButton.click();
    }

    async addUserForm({ username, age }, type) {
        // Validate path url after clicking "Add User" button
        await this.driver.wait(
            until.urlContains("/add"),
            3000, // Wait for up to 3 seconds for the URL to contain "/add"
            "Expected URL to contain '/add' after clicking 'Add User' button"
        );
        const currentUrl = await this.driver.getCurrentUrl();
        assert.ok(
            currentUrl.includes("/add"),
            `Expected URL to contain '/add' after clicking 'Add User' button, but got '${currentUrl}'`
        );

        // Validate title card on add user page
        const titleCardAddUser = await this.driver.findElement(
            By.xpath(this.#titleCardAddUserLocator)
        );
        const titleCardAddUserText = await titleCardAddUser.getText();
        assert.strictEqual(
            titleCardAddUserText,
            "Add Users",
            "Title card does not match expected value"
        );

        const usernameInput = await this.driver.findElement(
            By.xpath(this.#usernameInputLocator)
        );
        const ageInput = await this.driver.findElement(
            By.xpath(this.#ageInputLocator)
        );
        const submitButton = await this.driver.findElement(
            By.xpath(this.#buttonSubmitAddUserLocator)
        );

        const requiredUsernameMessage = "Please fill out this field.";
        switch (type) {
            case "empty":
                await this.#empty(usernameInput, submitButton, requiredUsernameMessage);
                break;
            case "missing":
                await this.#missing(
                    { username },
                    usernameInput, 
                    ageInput, 
                    submitButton, 
                    requiredUsernameMessage
                );
                break;
            case "invalid":
                await this.#invalid(
                    { username, age },
                    usernameInput,
                    ageInput,
                    submitButton,
                    requiredUsernameMessage
                );
                break;
            case "invalidAge":
                await this.#invalidAge(
                    { username, age }, 
                    usernameInput, 
                    ageInput, 
                    submitButton
                );
                break;
            case "add":
                await this.#add(
                    { username, age },
                    usernameInput,
                    ageInput,
                    submitButton
                );
                break;
            case "existing":
                await this.#existing({ username, age }, usernameInput, ageInput, submitButton);
                break;
        }
    }

    async goToShopPage() {
        const shopButton = await this.driver.findElement(
            By.xpath(this.#buttonShopLocator)
        );
        await shopButton.click();
    }

    async #empty(usernameInput, submitButton, requiredUsernameMessage) {
        await submitButton.click();

        await this.driver.sleep(1000); // Wait for 1 second to allow the validation message to appear

        await usernameInput.getAttribute("validationMessage").then((message) => {
            assert.ok(message, "Validation message is not displayed for empty username input");

            assert.strictEqual(
                message,
                requiredUsernameMessage,
                "Validation message does not match expected value"
            );
        });

        await super.takeScreenshot(
            await this.driver.findElement(By.xpath(this.#formContainerLocator)).takeScreenshot(),
            "add_user",
            "add_user_empty_validation.png"
        );
    }
    async #missing({ username }, usernameInput, ageInput, submitButton, requiredUsernameMessage) {
        await usernameInput.sendKeys(username);
        await submitButton.click();

        await this.driver.sleep(1000); // Wait for 1 second to allow the validation message to appear

        await ageInput.getAttribute("validationMessage").then((message) => {
            assert.ok(message, "Validation message is not displayed for empty age input");

            assert.strictEqual(
                message,
                requiredUsernameMessage,
                "Validation message does not match expected value"
            );
        });

        await super.takeScreenshot(
            await this.driver.findElement(By.xpath(this.#formContainerLocator)).takeScreenshot(),
            "add_user",
            "add_user_missing_validation.png"
        );
    }
    async #invalid({ username, age }, usernameInput, ageInput, submitButton, requiredUsernameMessage) {
        await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
        await ageInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

        await usernameInput.sendKeys(username);
        await ageInput.sendKeys(age);

        // Validate value of username and age input after sending invalid data
        const usernameInputValue = await usernameInput.getAttribute("value");
        const ageInputValue = await ageInput.getAttribute("value");
        
        const maxlength = await usernameInput.getAttribute("maxlength");
        assert.strictEqual(maxlength, "10", "Expected maxlength attribute to be 10 for username input");

        const convertedMaxlength = Number(maxlength);
        assert.strictEqual(convertedMaxlength, 10, "Expected maxlength attribute to be 10 for username input");

        if (typeof username === "string" && username.length > convertedMaxlength) {
            // Exit the function early if the username exceeds maxlength
            assert.ok(
                usernameInputValue.length <= convertedMaxlength,
                `Expected username input length <= ${convertedMaxlength}, but got ${usernameInputValue.length} ('${usernameInputValue}')`
            );

            return;
        } else if (typeof username === "number") {
            assert.strictEqual(
                usernameInputValue,
                "",
                `Expected username input value to be empty, but got '${usernameInputValue}'`
            );
        }
        assert.strictEqual(ageInputValue, String(age), "Expected age input value to hold the entered string");

        await submitButton.click();

        await this.driver.sleep(1000); // Wait for 1 second to allow the validation message to appear

        await usernameInput.getAttribute("validationMessage").then((message) => {
            assert.ok(message, "Validation message is not displayed for invalid username input");

            assert.strictEqual(
                message,
                requiredUsernameMessage,
                "Validation message does not match expected value"
            );
        });

        await super.takeScreenshot(
            await this.driver.findElement(By.xpath(this.#formContainerLocator)).takeScreenshot(),
            "add_user",
            "add_user_invalid_validation.png"
        );
    }
    async #invalidAge({ username, age }, usernameInput, ageInput, submitButton) {
        await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
        await ageInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

        await usernameInput.sendKeys(username);
        await ageInput.sendKeys(age);
        await submitButton.click();

        await this.driver.sleep(1000);

        // Ekspektasi pesan validasi
        const expectedToastText = "Age cannot be negative.";
        await this.toastElement(
            expectedToastText,
            async (toastContainer) => {
                await super.takeScreenshot(
                    await toastContainer.takeScreenshot(),
                    "add_user",
                    "add_user_invalid_age_validation.png"
                );
            }
        );
    }
    async #add({ username, age }, usernameInput, ageInput, submitButton) {
        await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
        await ageInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

        await usernameInput.sendKeys(username);
        await ageInput.sendKeys(String(age));
        await submitButton.click();

        await this.driver.sleep(1000);

        this.#expectedToastText = `User successfully added, Hi ${username}!`;

        await this.toastElement(
            this.#expectedToastText,
            async (toastContainer) => {
                await super.takeScreenshot(
                    await toastContainer.takeScreenshot(),
                    "add_user",
                    "add_user_success_validation.png"
                );
            }
        );
    }
    async #existing({ username, age }, usernameInput, ageInput, submitButton) {
        await usernameInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);
        await ageInput.sendKeys(Key.chord(Key.CONTROL, "a"), Key.DELETE);

        await usernameInput.sendKeys(username);
        await ageInput.sendKeys(String(age));
        await submitButton.click();

        await this.driver.sleep(1000);

        const expectedExistingUserToastText = `User with username ${username} already exists.`;

        await this.toastElement(
            expectedExistingUserToastText,
            async (toastContainer) => {
                await super.takeScreenshot(
                    await toastContainer.takeScreenshot(),
                    "add_user",
                    "add_user_existing_user_validation.png"
                );
            }
        );
    }
}