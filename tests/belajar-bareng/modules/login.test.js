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

            describe("Verify that the login page loads successfully with correct title, URL, and visible login form", () => this.#verifyLoginPage());
            
            describe("Should fail to login with empty credentials", () => this.#emptyLogin());

            describe("Should fail to login with missing credentials", () => this.#missingLogin());
            
            describe("Should fail to login with invalid credentials", () => this.#invalidLogin());

            describe("Should successfully login with valid credentials", () => this.#validLogin());
        });
    }

    #verifyLoginPage() {
        it("Should open the base URL successfully", async () => {
            await this.testContext.belajarBareng.loginPage.open(
                `${this.loginUrl}/login`,
                `Login - ${this.testContext.title}`
            );
        });
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

    #missingLogin() {
        it("Should fail to login with missing credentials", async () => {
            await this.loginPage.loginForm(
                this.#data.emptyData,
                "missing"
            );
        });
    }

    #invalidLogin() {
        it("Should fail to login with invalid credentials", async () => {
            await this.loginPage.loginForm(
                this.#data.emptyData,
                "invalid"
            );
        });
    }

    #validLogin() {
        it("Should login successfully", async () => {
            await this.loginPage.loginForm(
                this.#data.validData,
                "valid"
            );
        });
    }
}