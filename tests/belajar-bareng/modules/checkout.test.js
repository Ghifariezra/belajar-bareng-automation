import { before, describe, it } from "mocha";

export class CheckoutTest {
    constructor(testContext) {
        this.testContext = testContext;
    }

    run() {
        describe.skip("Unstable for Firefox: Checkout Page Functionality", () => {
            before(async () => {
                this.userCheckout = this.testContext.belajarBareng.checkout;
            });

            it("User should be able to complete checkout", async () => await this.#checkout());
        });
    }

    async #checkout() {
        await this.userCheckout.checkout();
    }
}