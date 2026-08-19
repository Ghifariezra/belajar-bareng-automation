import assert from "assert";
import { before, describe, it } from "mocha";

export class AddUsersTest {
    constructor(testContext) {
        this.testContext = testContext;
    }

    run() {
        describe("Add Users Page Functionality", () => {
            before(async () => {
                this.addUsersPage = this.testContext.belajarBareng.addUsers;
            });

            this.#navigateToAddUsersPage(this.addUsersPage);
        });
    }

    #navigateToAddUsersPage(addUsersDriver) {
        it.skip("Should navigate to add users page successfully", async () => {
            await addUsersDriver.open(this.testContext.baseUrl + "/add-users");

            let title = await this.testContext.driver.getTitle();
            console.log("Page title:", title);
            assert.strictEqual(title, "Add Users");
        });
    }
}