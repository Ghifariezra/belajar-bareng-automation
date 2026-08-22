import { Key } from "selenium-webdriver";
import { BasePage } from "../core/base.driver.js";
import { DashboardLocators } from "../locators/dashboard.locator.js";

export class DashboardPage extends BasePage {
    constructor(driver, folderName, browser) {
        super(driver, folderName, browser);
    }

    // --- Actions & Navigation ---

    async getTitleCardDashboard() {
        const titleCardUsers = await this.driver.findElement(DashboardLocators.titleUsersCard);
        return await titleCardUsers.getText();
    }

    async goToAddUserPage() {
        const addUserButton = await this.driver.findElement(DashboardLocators.addUser.openButton);
        await addUserButton.click();
    }

    async goToShopPage() {
        const shopButton = await this.driver.findElement(DashboardLocators.navigation.shopButton);
        await shopButton.click();
    }

    async addUser(data = {}) {
        await this.inputUserData(data.username, data.age);
        await this.submitAddUserForm();
        await this.driver.sleep(1000);
    }

    async inputUserData(username, age) {
        const usernameInput = await this.driver.findElement(DashboardLocators.addUser.usernameInput);
        const ageInput = await this.driver.findElement(DashboardLocators.addUser.ageInput);

        if (username !== undefined && username !== null) {
            await usernameInput.sendKeys(username);
        }
        if (age !== undefined && age !== null) {
            await ageInput.sendKeys(String(age));
        }
    }

    async submitAddUserForm() {
        const submitButton = await this.driver.findElement(DashboardLocators.addUser.submitButton);
        await submitButton.click();
    }

    async clearFormInputs() {
        const usernameInput = await this.driver.findElement(DashboardLocators.addUser.usernameInput);
        const ageInput = await this.driver.findElement(DashboardLocators.addUser.ageInput);

        await usernameInput.sendKeys(Key.CONTROL, "a", Key.DELETE);
        await ageInput.sendKeys(Key.CONTROL, "a", Key.DELETE);
    }

    // --- Getters & Assertions Support ---

    async getUsernameValidationMessage() {
        const usernameInput = await this.driver.findElement(DashboardLocators.addUser.usernameInput);
        return await usernameInput.getAttribute("validationMessage");
    }

    async getAgeValidationMessage() {
        const ageInput = await this.driver.findElement(DashboardLocators.addUser.ageInput);
        return await ageInput.getAttribute("validationMessage");
    }

    async getDataInputs() {
        const usernameInput = await this.driver.findElement(DashboardLocators.addUser.usernameInput);
        const ageInput = await this.driver.findElement(DashboardLocators.addUser.ageInput);

        const usernameValue = await usernameInput.getAttribute("value");
        const ageValue = await ageInput.getAttribute("value");
        const maxlengthUsername = await usernameInput.getAttribute("maxlength");

        return {
            username: usernameValue,
            age: ageValue,
            maxLengthUsername: Number(maxlengthUsername),
        };
    }

    async getToastMessage(expectedMessage, filename) {
        await this.toastElement(expectedMessage, async (toastContainer) => {
            await super.takeScreenshot(
                await toastContainer.takeScreenshot(),
                "add_user",
                filename || "add_user_form_toast_message.png"
            );
        });
    }

    async takeScreenshotOfFormBox(folderPath, filename) {
        const formBoxElement = await this.driver.findElement(DashboardLocators.formContainer);
        const screenshot = await formBoxElement.takeScreenshot();
        await super.takeScreenshot(screenshot, folderPath, filename);
    }
}