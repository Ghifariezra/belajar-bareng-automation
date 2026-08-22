import assert from "assert";
import { describe, before, beforeEach, afterEach, it } from "mocha";
import { handleAfterEach } from "../helpers/test.helper.js";

const TEST_DATA = Object.freeze({
    newUser: { username: "QuizLovers", age: 300 },
    missingAge: { username: "QuizLovers" },
    invalidTypes: { username: 123, age: "300" },
    longUsername: { username: "axaxaxaxaxaxa", age: "300" },
    zeroAge: { username: "AgeisZero", age: 0 },
});

const CONSTANTS = {
    TITLE_CARD: "List Users",
    REQUIRED_VALIDATION_MESSAGE: "Please fill out this field.",
    FOLDER_PATH: "add_user"
};

export function runDashboardTests(testContext) {
    let dashboardPage;

    const screenshotConfig = {
        folderPath: CONSTANTS.FOLDER_PATH,
        screenshotType: "form",
        expectedToastMessage: ""
    };

    describe("Add Users Page Functionality", function () {
        before(async function () {
            dashboardPage = testContext.belajarBareng.dashboard;

            const titleCard = await dashboardPage.getTitleCardDashboard();
            assert.strictEqual(
                titleCard,
                CONSTANTS.TITLE_CARD,
                `Expected title card to be "${CONSTANTS.TITLE_CARD}", but got "${titleCard}"`
            );

            await dashboardPage.goToAddUserPage();
        });

        beforeEach(async function () {
            await dashboardPage.clearFormInputs();
            screenshotConfig.screenshotType = "form";
            screenshotConfig.expectedToastMessage = "";
        });

        afterEach(async function () {
            await handleAfterEach(this.currentTest, dashboardPage, testContext, screenshotConfig);
        });

        describe("Empty Submissions", function () {
            it("Should block add user form submission when username is empty", async function () {
                await dashboardPage.addUser();

                const usernameValidationMessage = await dashboardPage.getUsernameValidationMessage();
                const ageValidationMessage = await dashboardPage.getAgeValidationMessage();

                assert.strictEqual(
                    usernameValidationMessage,
                    CONSTANTS.REQUIRED_VALIDATION_MESSAGE,
                    `Expected username validation message to be "${CONSTANTS.REQUIRED_VALIDATION_MESSAGE}", but got "${usernameValidationMessage}"`
                );

                assert.strictEqual(
                    ageValidationMessage,
                    CONSTANTS.REQUIRED_VALIDATION_MESSAGE,
                    `Expected age validation message to be "${CONSTANTS.REQUIRED_VALIDATION_MESSAGE}", but got "${ageValidationMessage}"`
                );
            });
        });

        describe("Missing Submissions", function () {
            it("Should block add user form submission when username or age is missing", async function () {
                await dashboardPage.addUser(TEST_DATA.missingAge);

                const ageValidationMessage = await dashboardPage.getAgeValidationMessage();

                assert.strictEqual(
                    ageValidationMessage,
                    CONSTANTS.REQUIRED_VALIDATION_MESSAGE,
                    `Expected age validation message to be "${CONSTANTS.REQUIRED_VALIDATION_MESSAGE}", but got "${ageValidationMessage}"`
                );
            });
        });

        describe("Invalid Submissions", function () {
            it("Should block add user form submission when username and age is invalid", async function () {
                const rawData = TEST_DATA.invalidTypes;

                await dashboardPage.inputUserData(rawData.username, rawData.age);
                const { username, age, maxLengthUsername } = await dashboardPage.getDataInputs();

                if (typeof rawData.username === "number") {
                    assert.strictEqual(
                        username,
                        "",
                        `Expected username input to reject numeric value and stay empty, but got "${username}"`
                    );
                } else {
                    assert.strictEqual(
                        username,
                        String(rawData.username),
                        `Expected DOM username value to be "${rawData.username}", but got "${username}"`
                    );
                }

                assert.strictEqual(
                    age,
                    String(rawData.age),
                    `Expected DOM age value to be "${rawData.age}", but got "${age}"`
                );

                assert.ok(
                    username.length <= maxLengthUsername,
                    `Username length (${username.length}) exceeds maximum allowed length of ${maxLengthUsername}`
                );

                await dashboardPage.submitAddUserForm();
            });

            it("Characters in the username input should not be longer than 10 characters", async function () {
                await dashboardPage.inputUserData(
                    TEST_DATA.longUsername.username,
                    TEST_DATA.longUsername.age
                );
                const { username, maxLengthUsername } = await dashboardPage.getDataInputs();

                assert.ok(
                    username.length <= maxLengthUsername,
                    `Expected username length <= ${maxLengthUsername}, but got ${username.length}`
                );
            });
        });

        describe("Successful Submissions", function () {
            it.skip("Should block add user when the age fill 0", async function () {
                await dashboardPage.addUser(TEST_DATA.zeroAge);
                screenshotConfig.expectedToastMessage = "Age cannot be negative.";
                screenshotConfig.screenshotType = "toast";
            });

            it("Should add a new user successfully", async function () {
                await dashboardPage.addUser(TEST_DATA.newUser);
                screenshotConfig.expectedToastMessage = `User successfully added, Hi ${TEST_DATA.newUser.username}!`;
                screenshotConfig.screenshotType = "toast";
            });

            it.skip("Should block add user when the username already exists", async function () {
                await dashboardPage.addUser(TEST_DATA.newUser);
                screenshotConfig.expectedToastMessage = `User with username ${TEST_DATA.newUser.username} already exists.`;
                screenshotConfig.screenshotType = "toast";
            });
        });

        describe("Navigation", function () {
            it("Should go to the shop page", async function () {
                await dashboardPage.goToShopPage();
            });
        });
    });
}