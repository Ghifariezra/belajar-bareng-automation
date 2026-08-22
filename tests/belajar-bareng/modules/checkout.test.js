import { describe, it } from "mocha";

export function runCheckoutTests(testContext) {
    describe.skip("Unstable for Firefox: Checkout Page Functionality", function () {
        it("User should be able to complete checkout", async function () {
            const checkoutPage = testContext.belajarBareng.checkout;
            await checkoutPage.checkout();
        });
    });
}