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

            describe("User should be able to complete checkout", () => this.#checkout());
        });
    }

    #checkout() {
        const self = this;
        it("User should be able to checkout", async function () {
            this.timeout(20000);
            await self.userCheckout.checkout();
        });
    }
}