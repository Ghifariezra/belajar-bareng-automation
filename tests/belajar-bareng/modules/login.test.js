import { By } from "selenium-webdriver";
import assert from "assert";
import { before, describe, it } from "mocha";

export class LoginTest {
    #data;

    constructor(testContext) {
        this.testContext = testContext;
    }

    run() {
        // describe("Login Page Functionality", () => {
        describe("User should be able to login, add a new user, and complete checkout", () => {
            before(async () => {
                this.#data = {
                    validData: {
                        username: "admin",
                        password: "admin",
                    },
                    invalidData: {
                        username: "invalid",
                        password: "invalid",
                    },
                }
                this.loginUrl = `${this.testContext.baseUrl}`;
                this.loginPage = this.testContext.belajarBareng.loginPage;
                this.addUsersPage = this.testContext.belajarBareng.addUsers;
                this.userCheckout = this.testContext.belajarBareng.checkout;
            });

            it("Should return true when navigating to login page. Page title should be 'Login - User Management', page URL should be 'https://belajar-bareng.onrender.com/' and on the page should be the login form", async () => {
                await this.testContext.belajarBareng.loginPage.open(
                    this.loginUrl,
                    `${this.testContext.title}`
                );
            });

            it("Should login successfully", async () => {
                await this.loginPage.loginForm();
            });

            it("Should go to the users page", async () => {
                await this.addUsersPage.goToAddUserPage();
            });

            it("Should add a new user successfully", async () => {
                await this.addUsersPage.addUserForm(
                    `Quiz User`,
                    300
                );
            });

            it("User should be able to checkout", async () => {
                await this.userCheckout.checkout();
            });
            
            // it.skip("Should go to the dashboard when login with valid credentials and validate path url after login", async () => {
            //     await this.loginPage.loginForm();
            // });

            // it.skip("Should login successfully", async () => {
            //     assert.ok(true, "Login functionality test passed");
            // });
        });
    }
}