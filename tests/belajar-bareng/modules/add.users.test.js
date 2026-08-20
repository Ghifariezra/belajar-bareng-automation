import { before, describe, it } from "mocha";

export class AddUsersTest {
    #data;

    constructor(testContext) {
        this.testContext = testContext;
    }

    run() {
        describe("Add Users Page Functionality", () => {
            before(async () => {
                this.#data = {
                    emptyData: {},
                    newUser: {
                        username: "Quiz User",
                        age: 300,
                    },
                };
                this.addUsersPage = this.testContext.belajarBareng.addUsers;
            });

            describe("Should block add user form submission when username or age is empty", () => this.#addUserEmpty());
            describe("Should block add user form submission when username or age is missing", () => this.#addUserMissing());
            describe("Should block add user form submission when username or age is invalid", () => this.#addUserInvalid());
            describe("User should be able to add a new user", () => this.#addNewUser());
        });
    }

    #addUserEmpty(){
        it("Should go to the users page", async () => {
            await this.addUsersPage.goToAddUserPage();
        });

        it("Should block add user form submission when username is empty", async () => {
            await this.addUsersPage.addUserForm(
                this.#data.emptyData,
                "empty"
            );
        });
    }

    #addUserMissing() {
        it("Should block add user form submission when username or age is missing", async () => {
            this.#data.emptyData = {
                username: "Quiz User",
            }
            await this.addUsersPage.addUserForm(this.#data.emptyData, "missing");
        });
    }

    #addUserInvalid() {
        it("Should block add user form submission when username or age is invalid", async () => {
            this.#data.emptyData = {
                username: 123,
                age: "300",
            };
            await this.addUsersPage.addUserForm(this.#data.emptyData, "invalid");
        });

        it("Characters in the username input should not longer be than 10 characters", async () => {
            this.#data.emptyData = {
                username: "axaxaxaxaxaxa",
                age: "300",
            };
            await this.addUsersPage.addUserForm(this.#data.emptyData, "invalid");
        });
    }

    #addNewUser() {
        it("Should block add user when the age fill 0", async () => {
            this.#data.emptyData = {
                username: "Age is Zero",
                age: 0,
            };
            await this.addUsersPage.addUserForm(this.#data.emptyData, "invalidAge");
        });
        
        it("Should add a new user successfully", async () => {
            await this.addUsersPage.addUserForm(this.#data.newUser, "add");
        });

        it("Should block add user when the username already exists", async () => {
            await this.addUsersPage.addUserForm(this.#data.newUser, "existing");
        });

        it("Should go to the shop page", async () => {
            await this.addUsersPage.goToShopPage();
        });
    }
}