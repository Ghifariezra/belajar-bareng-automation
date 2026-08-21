import { before, describe, it } from "mocha";

export class LoginTest {
    #data;

    constructor(testContext) {
        this.testContext = testContext;
    }

    run() {
        describe("Login Page Functionality", () => {
            before(async () => {
                this.#data = {
                    emptyData: {},
                    validData: {
                        username: "admin",
                        password: "admin",
                    },
                }
                this.loginUrl = `${this.testContext.baseUrl}`;
                this.loginPage = this.testContext.belajarBareng.loginPage;
            });

            it.skip("Should open the base URL successfully", async () => await this.#verifyLoginPage());
            
            this.#emptyLogin();

            it("Should fail to login with missing credentials", async () => await this.#missingLogin());
            
            it("Should fail to login with invalid credentials", async () => await this.#invalidLogin());

            it("Should login successfully", async () => await this.#validLogin());

            it("Should navigate to the users page after successful login", async () => await this.#goToUsersPage());
        });
    }

    async #verifyLoginPage() {
        await this.testContext.belajarBareng.loginPage.open(
            `${this.loginUrl}/login`,
            `${this.testContext.title}`
        );
    }

    #emptyLogin() {
        it("Should open the base URL successfully", async () => {
            await this.testContext.belajarBareng.loginPage.open(
                `${this.loginUrl}/`,
                `${this.testContext.title}`
            );
        });

        it("Should fail to login with empty credentials", async () => {
            await this.loginPage.loginForm(
                this.#data.emptyData,
                "empty"
            );
        });
    }

    async #missingLogin() {
        await this.loginPage.loginForm(
            this.#data.emptyData,
            "missing"
        );
    }

    async #invalidLogin() {
        await this.loginPage.loginForm(
            this.#data.emptyData,
            "invalid"
        );
    }

    async #validLogin() {
        await this.loginPage.loginForm(
            this.#data.validData,
            "valid"
        );
        
    }

    async #goToUsersPage() {
        await this.loginPage.goToUsersPage();
    }
}