import { describe, it } from "mocha";

export class DashboardTest {
    #testContext;

    #testData = Object.freeze({
        newUser: { username: "QuizLovers", age: 300 },
        missingAge: { username: "QuizLovers" },
        invalidTypes: { username: 123, age: "300" },
        longUsername: { username: "axaxaxaxaxaxa", age: "300" },
        zeroAge: { username: "AgeisZero", age: 0 },
    });

    constructor(testContext) {
        this.#testContext = testContext;
    }

    get dashboardPage() {
        return this.#testContext.belajarBareng.dashboard;
    }

    run() {
        describe("Add Users Page Functionality", () => {
            this.#testEmptySubmissions();
            this.#testMissingSubmissions();
            this.#testInvalidSubmissions();
            this.#testSuccessfulSubmissions();
        });
    }

    #testEmptySubmissions() {
        it("Should go to the users page", async () => {
            await this.dashboardPage.goToAddUserPage();
        });

        it("Should block add user form submission when username is empty", async () => {
            await this.dashboardPage.addUserForm({}, "empty");
        });
    }

    #testMissingSubmissions() {
        it("Should block add user form submission when username or age is missing", async () => {
            await this.dashboardPage.addUserForm(this.#testData.missingAge, "missing");
        });
    }

    #testInvalidSubmissions() {
        it("Should block add user form submission when username or age is invalid", async () => {
            await this.dashboardPage.addUserForm(this.#testData.invalidTypes, "invalid");
        });

        it("Characters in the username input should not be longer than 10 characters", async () => {
            await this.dashboardPage.addUserForm(this.#testData.longUsername, "invalid");
        });
    }

    #testSuccessfulSubmissions() {
        it.skip("Should block add user when the age fill 0", async () => {
            await this.dashboardPage.addUserForm(this.#testData.zeroAge, "invalidAge");
        });

        it("Should add a new user successfully", async () => {
            await this.dashboardPage.addUserForm(this.#testData.newUser, "add");
        });

        it.skip("Should block add user when the username already exists", async () => {
            await this.dashboardPage.addUserForm(this.#testData.newUser, "existing");
        });

        it("Should go to the shop page", async () => {
            await this.dashboardPage.goToShopPage();
        });
    }
}