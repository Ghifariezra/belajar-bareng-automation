import assert from "assert";
import { before, after, beforeEach, afterEach, describe, it } from "mocha";

export class LoginTest {
    #data;
    folderPath = "login";
    expectedFormTitle = "Sign in";
    expectedToastMessage = "Invalid username or password!";
    requiredValidationMessage = "Please fill out this field.";
    expectedUrlAfterLogin = "/users";
    screenshotType = "form";

    constructor(testContext) {
        this.testContext = testContext;
    }

    get loginPage() {
        return this.testContext.belajarBareng.login;
    }

    run() {
        // to prevent conflicts related to this context
        const handleAfterEach = async (mochaTest) => {
            if (!mochaTest) return;

            const { state, err, title } = mochaTest;
            const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

            if (state === "failed" && err) {
                if (err instanceof assert.AssertionError) {
                    const cleanExpected = String(err.expected ?? "empty").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
                    const cleanActual = String(err.actual ?? "empty").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

                    await this.loginPage.takeScreenshotOfFormBox(
                        `${this.folderPath}/bugs/${cleanExpected}_vs_${cleanActual}`,
                        `${cleanTitle}.png`
                    );
                } else {
                    await this.loginPage.takeScreenshotOfFormBox(
                        `${this.folderPath}/errors/other`,
                        `${cleanTitle}.png`
                    );
                }
            } else if (state === "passed") {
                if (this.screenshotType === "form") {
                    await this.loginPage.takeScreenshotOfFormBox(
                        `${this.folderPath}/success`,
                        `${cleanTitle}.png`
                    );
                } else if (this.screenshotType === "toast") {
                    await this.loginPage.getToastMessage(
                        this.expectedToastMessage,
                        `success/${cleanTitle}.png`
                    );
                } else if (this.screenshotType === "full") {
                    await this.loginPage.takeScreenshot(
                        await this.testContext.driver.takeScreenshot(),
                        `${this.folderPath}/success`,
                        `${cleanTitle}.png`
                    );
                }
            }
        };

        describe("Login Page Functionality", () => {
            before(async () => {
                this.#data = {
                    username: "admin",
                    password: "admin"
                };
            });

            after(async () => {
                const currentUrl = await this.loginPage.validateUsersPage(this.expectedUrlAfterLogin);

                assert.strictEqual(
                    currentUrl,
                    new URL(this.expectedUrlAfterLogin, this.testContext.baseUrl).href,
                    "Current URL does not match expected value after login"
                );

                await this.loginPage.takeScreenshot(
                    await this.testContext.driver.takeScreenshot(),
                    this.folderPath,
                    "login_success.png"
                );
            });

            beforeEach(async () => {
                await this.loginPage.clearFormInputs();
                this.screenshotType = "form";
            });

            afterEach(async function () {
                await handleAfterEach(this.currentTest);
            });

            it("Should validate the login form", async () => await this.#validatePage());
            it("Should fail to login with empty credentials", async () => await this.#emptyLogin());
            it("Should fail to login with missing credentials", async () => await this.#missingLogin());
            it("Should fail to login with invalid credentials", async () => await this.#invalidLogin());
            it("Should login successfully", async () => await this.#validLogin());
        });
    }

    async #validatePage() {
        const { pageTitle, currentUrl, formTitle } = await this.loginPage.getFormData();

        assert.strictEqual(pageTitle, this.testContext.title, "Page title does not match expected value");
        assert.strictEqual(currentUrl, this.testContext.baseUrl.href, "Current URL does not match expected value");
        assert.strictEqual(formTitle, this.expectedFormTitle, "Form title does not match expected value");
    }

    async #emptyLogin() {
        await this.loginPage.login();

        const usernameValidationMessage = await this.loginPage.getUsernameValidationMessage();
        const passwordValidationMessage = await this.loginPage.getPasswordValidationMessage();

        assert.ok(usernameValidationMessage, "Username validation message should not be empty");
        assert.ok(passwordValidationMessage, "Password validation message should not be empty");

        assert.strictEqual(usernameValidationMessage, this.requiredValidationMessage);
        assert.strictEqual(passwordValidationMessage, this.requiredValidationMessage);
    }

    async #missingLogin() {
        await this.loginPage.login("Heyowwww");

        const passwordValidationMessage = await this.loginPage.getPasswordValidationMessage();

        assert.ok(passwordValidationMessage, "Password validation message should not be empty");
        assert.strictEqual(passwordValidationMessage, this.requiredValidationMessage);
    }

    async #invalidLogin() {
        this.screenshotType = "toast";

        await this.loginPage.login("invalidUser", "invalidPass");
    }

    async #validLogin() {
        const hintData = await this.loginPage.getHintData();

        assert.ok(hintData.username, "Username hint should not be empty");
        assert.ok(hintData.password, "Password hint should not be empty");

        const cleanUsername = this.loginPage.cleanCredential(hintData.username);
        const cleanPassword = this.loginPage.cleanCredential(hintData.password);

        assert.strictEqual(cleanUsername, this.#data.username);
        assert.strictEqual(cleanPassword, this.#data.password);

        await this.loginPage.login(this.#data.username, this.#data.password);

        this.screenshotType = "full";
    }
}