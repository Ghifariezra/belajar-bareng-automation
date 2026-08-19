import assert from "assert";
import { By, until } from "selenium-webdriver";
import { BasePage } from "../core/base.driver.js";

export class AddUsers extends BasePage {
    // Form Users Locator
    #titleCardUsersLocator = `//*[@id="app"]/div/div/div/h2`;
    #buttonAddUserLocator = "//button[@data-testid='add-button']";

    // Form Add User Locator
    #titleCardAddUserLocator = `//*[@id="app"]/div/div/h2`;
    #subTitleCardAddUserLocator = `//*[@id="app"]/div/div/div[1]`;

    // Input Add User Locator
    #usernameInputLocator = "//input[@data-testid='username-input']";
    #ageInputLocator = "//input[@data-testid='age-input']";
    #buttonSubmitAddUserLocator = "//button[@data-testid='submit-button']";

    // Toast Add User Locator
    #toastContainerLocator = "//div[@data-testid='Toastify__toast-container--top-right']";
    #toastAddUserLocator = "//div[@data-testid='toast-content']";

    // Shop Page Locator
    #buttonShopLocator = '//button[@data-testid="shop-button"]';

    constructor(driver, folderName) {
        super(driver, folderName);
    }

    async goToAddUserPage() {
        // Validate path url after login
        await this.driver.wait(
            until.urlContains("/users"),
            3000, // Wait for up to 3 seconds for the URL to contain "/users"
            "Expected URL to contain '/users' after login"
        );
        const currentUrl = await this.driver.getCurrentUrl();
        assert.ok(
            currentUrl.includes("/users"),
            `Expected URL to contain '/users' after login, but got '${currentUrl}'`
        );

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

    async addUserForm(username, age) {
        // Validate input parameters
        assert.ok(username, "Username is required");
        assert.ok(age, "Age is required");
        assert.strictEqual(typeof username, "string", "Username must be a string");
        assert.strictEqual(typeof age, "number", "Age must be a number");

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

        await usernameInput.sendKeys(username);
        await ageInput.sendKeys(age);
        await submitButton.click();

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
        // console.log("Toast message after adding user:", toastAddUserText);

        // const expectedToastText = `User successfully added, Hi ${username}!`;
        const expectedManipulatedToastText = `User successfully added, Hi ${username.split(' ').join('')}!`;
        assert.strictEqual(
            toastAddUserText, // <- Actual toast message
            // expectedToastText,  // <- Expected toast message
            expectedManipulatedToastText,
            "Toast message does not match expected value"
        );

        await this.driver.wait(
            until.stalenessOf(toastContainer),
            5000,
            "Expected toast message to disappear automatically"
        );

        const shopButton = await this.driver.findElement(
            By.xpath(this.#buttonShopLocator)
        );
        await shopButton.click();
    }
}