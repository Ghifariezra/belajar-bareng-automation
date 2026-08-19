import { Builder, By } from "selenium-webdriver";
import assert from "assert";

describe("Open Google", function () {

    it("Should open Google homepage", async function () {

        const driver = await new Builder().forBrowser("chrome").build();

        await driver.get("https://www.saucedemo.com");

        let usernameInput = await driver.findElement({ id: "user-name" });
        let passwordInput = await driver.findElement({ id: "password" });
        let loginButton = await driver.findElement({ id: "login-button" });


        await usernameInput.sendKeys("standard_user");
        await passwordInput.sendKeys("secret_sauce");
        await loginButton.click();

        let shoppingCart = await driver.findElement(
            By.xpath("//*[@data-test='shopping-cart-link']")
        );

        let title = await driver.getTitle();

        assert.strictEqual(title, "Swag Labs");
        await shoppingCart.isDisplayed();
        await driver.quit();

    });

});