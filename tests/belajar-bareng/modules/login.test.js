import assert from "assert";
import { describe, before, after, beforeEach, afterEach, it } from "mocha";
import { handleAfterEach } from "../helpers/test.helper.js";

const CONSTANTS = {
    FOLDER_PATH: "login",
    EXPECTED_FORM_TITLE: "Sign in",
    EXPECTED_TOAST_MESSAGE: "Invalid username or password!",
    REQUIRED_VALIDATION_MESSAGE: "Please fill out this field.",
    EXPECTED_URL_AFTER_LOGIN: "/users"
};

const TEST_DATA = {
    username: "admin",
    password: "admin"
};

export function runLoginTests(testContext) {
    let loginPage;

    const screenshotConfig = {
        folderPath: CONSTANTS.FOLDER_PATH,
        screenshotType: "form",
        expectedToastMessage: CONSTANTS.EXPECTED_TOAST_MESSAGE
    };

    describe("Login Page Functionality", function () {
        before(function () {
            loginPage = testContext.belajarBareng.login;
        });

        after(async function () {
            const currentUrl = await loginPage.validateUsersPage(CONSTANTS.EXPECTED_URL_AFTER_LOGIN);

            assert.strictEqual(
                currentUrl,
                new URL(CONSTANTS.EXPECTED_URL_AFTER_LOGIN, testContext.baseUrl).href,
                "Current URL does not match expected value after login"
            );

            await loginPage.takeScreenshot(
                await testContext.driver.takeScreenshot(),
                CONSTANTS.FOLDER_PATH,
                "login_success.png"
            );
        });

        beforeEach(async function () {
            await loginPage.clearFormInputs();
            screenshotConfig.screenshotType = "form";
            screenshotConfig.expectedToastMessage = CONSTANTS.EXPECTED_TOAST_MESSAGE;
        });

        afterEach(async function () {
            await handleAfterEach(this.currentTest, loginPage, testContext, screenshotConfig);
        });

        it("Should validate the login form", async function () {
            const { pageTitle, currentUrl, formTitle } = await loginPage.getFormData();

            assert.strictEqual(pageTitle, testContext.title, "Page title does not match expected value");
            assert.strictEqual(currentUrl, testContext.baseUrl.href, "Current URL does not match expected value");
            assert.strictEqual(formTitle, CONSTANTS.EXPECTED_FORM_TITLE, "Form title does not match expected value");
        });

        it("Should fail to login with empty credentials", async function () {
            await loginPage.login();

            const usernameValidationMessage = await loginPage.getUsernameValidationMessage();
            const passwordValidationMessage = await loginPage.getPasswordValidationMessage();

            assert.ok(usernameValidationMessage, "Username validation message should not be empty");
            assert.ok(passwordValidationMessage, "Password validation message should not be empty");

            assert.strictEqual(usernameValidationMessage, CONSTANTS.REQUIRED_VALIDATION_MESSAGE);
            assert.strictEqual(passwordValidationMessage, CONSTANTS.REQUIRED_VALIDATION_MESSAGE);
        });

        it("Should fail to login with missing credentials", async function () {
            await loginPage.login("Heyowwww");

            const passwordValidationMessage = await loginPage.getPasswordValidationMessage();

            assert.ok(passwordValidationMessage, "Password validation message should not be empty");
            assert.strictEqual(passwordValidationMessage, CONSTANTS.REQUIRED_VALIDATION_MESSAGE);
        });

        it("Should fail to login with invalid credentials", async function () {
            screenshotConfig.screenshotType = "toast";

            await loginPage.login("invalidUser", "invalidPass");
        });

        it("Should login successfully", async function () {
            const hintData = await loginPage.getHintData();

            assert.ok(hintData.username, "Username hint should not be empty");
            assert.ok(hintData.password, "Password hint should not be empty");

            const cleanUsername = loginPage.cleanCredential(hintData.username);
            const cleanPassword = loginPage.cleanCredential(hintData.password);

            assert.strictEqual(cleanUsername, TEST_DATA.username);
            assert.strictEqual(cleanPassword, TEST_DATA.password);

            await loginPage.login(TEST_DATA.username, TEST_DATA.password);

            screenshotConfig.screenshotType = "full";
        });
    });
}