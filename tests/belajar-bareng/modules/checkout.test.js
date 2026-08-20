import assert from "assert";
import { before, describe, it } from "mocha";

export class CheckoutTest {
    constructor(testContext) {
        this.testContext = testContext;
    }

    run() {
        describe("Checkout Page Functionality", () => {
            before(async () => {
                this.userCheckout = this.testContext.belajarBareng.checkout;
            });

            describe("User should be able to complete checkout", () => this.#checkout());
        });
    }

    #checkout() {
        it("User should be able to checkout", async () => {
            await this.userCheckout.checkout();
        });
    }
}