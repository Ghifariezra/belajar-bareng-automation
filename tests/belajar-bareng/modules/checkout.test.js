import { describe, it } from "mocha";

export class CheckoutTest {
    #testContext;

    constructor(testContext) {
        this.#testContext = testContext;
    }

    get checkoutPage() {
        return this.#testContext.belajarBareng.checkout;
    }

    run() {
        describe.skip("Unstable for Firefox: Checkout Page Functionality", () => {
            it("User should be able to complete checkout", async () => {
                await this.#testCheckoutProcess();
            });
        });
    }

    async #testCheckoutProcess() {
        await this.checkoutPage.checkout();
    }
}