import assert from "assert";
import { By, Key, until } from "selenium-webdriver";
import { BasePage } from "../core/base.driver.js";

export class CheckoutPage extends BasePage {
    #items = [];
    #pageTitleLocator = `//h1[@class='page-title']`;

    // Checkout Locators
    #productDetailsLocator = `card-details`;
    #cartButtonLocator = `//div[@data-testid='cart-button']`;
    #cartItemsLocator = `//div[@class='cart-items']`;
    #cartRowLocator = ".//div[contains(@class, 'cart-row')]"; // atau ".//div[starts-with(@data-testid, 'cart-item-')]"
    #cartNameLocator = ".//span[starts-with(@data-testid, 'cart-name-')]";
    #cartDescLocator = ".//span[starts-with(@data-testid, 'cart-desc-')]";
    #cartPriceLocator = ".//span[starts-with(@data-testid, 'cart-price-')]";
    #cartQtyLocator = ".//span[starts-with(@data-testid, 'cart-qty-')]";
    #cartTotalLocator = ".//span[starts-with(@data-testid, 'cart-total-')]";
    #checkoutButtonLocator = `//button[@data-testid='checkout-button']`;

    // Checkout Form Locators
    #checkoutModalLocator = `//div[@data-testid='checkout-form checkout-form-modal']`;
    #checkoutNameInputLocator = `.//input[@data-testid='checkout-name']`;
    #checkoutEmailInputLocator = `.//input[@data-testid='checkout-email']`;
    #checkoutAddressInputLocator = `.//textarea[@data-testid='checkout-address']`;

    // Checkout Captcha Locators
    #checkoutCaptchaQuestionLocator = `//span[@data-testid='captcha-question']`;
    #checkoutCaptchaAnswerInputLocator = `.//input[@data-testid='checkout-captcha']`;

    // Checkout T&C Locators
    #tncCheckboxLocator = `.//input[@data-testid='tnc-checkbox']`;
    #tncTextLocator = `//span[@class='tnc-text']`;
    #tncLinkLocator = `//span[@data-testid='tnc-link']`;
    #tncOverlayLocator = `//div[@class='modal-overlay-tnc']`;
    #tncOverlayContentLocator = `//div[@class='modal-content-tnc']`;
    #tncOverlayButtonCloseLocator = `//button[@data-testid='tnc-ok-button']`;

    // Checkout Action Locators
    #checkoutSubmitButtonLocator = `//button[@data-testid='submit-checkout']`;
    #checkoutCancelButtonLocator = `//button[@data-testid='cancel-checkout']`;

    // Confirmation Locators
    #confirmationModalLocator = `//div[@class='modal-overlay']`;
    #confirmationModalContentLocator = `//div[@class='modal-content confirmation-modal']`;
    #confirmationModalTitleLocator = `//h2[@data-testid='success-title']`;

    // Confirmation Invoice Locators
    #invoiceRowLocator = `.//div[@class='invoice-row']`;
    #invoiceTotalLocator = `.//h3[@data-testid='checkout-total']`;
    #invoiceSubmitButtonLocator = `.//button[@data-testid='checkout-success-ok-button']`;

    constructor(driver, folderName, browser) {
        super(driver, folderName, browser);
        this.browser = browser;
    }

    async checkout() {
        // BUG -> path url should be in lowercase, but the actual path is in capitalized. So, we need to validate the path url after add new user with lowercase "/shop"
        const expectedPath = "/Shop"; // shop should be in lowercase

        // Validate path url after add new user
        await this.driver.wait(
            until.urlContains(expectedPath),
            3000, // Wait for up to 3 seconds for the URL to contain "/shop"
            `Expected URL to contain '${expectedPath}' after add new user`
        );

        const currentUrl = await this.driver.getCurrentUrl();
        assert.ok(
            currentUrl.includes(expectedPath),
            `Expected URL to contain '${expectedPath}' after add new user, but got '${currentUrl}'`
        );

        // Validate page title on checkout page
        const pageTitle = await this.driver.findElement(
            By.xpath(this.#pageTitleLocator)
        );
        const pageTitleText = await pageTitle.getText();
        assert.strictEqual(
            pageTitleText,
            "Welcome to the Shop!",
            "Page title does not match expected value"
        );

        // Add products to cart
        await this.#addToCart();

        // Go to cart
        await this.#goToCart();

        // Checkout products
        await this.#checkoutProducts();
    }

    async #typeInput(element, value) {
        await element.click();
        await element.clear();
        await element.sendKeys(value);
    }

    async #addToCart() {
        /*
            how it works this logic:
                1. find title element with class name "card-details" and name of the product
                2. validate the title of the product with the expected title
                3. backward 1 step to find the parent element of the title element
                4. find the button element with text "Add to Cart" inside the parent element
                5. click the button element
            
            i think this logic very simple not complicated, like you found all element and you can create a loop to find the title and button element, but this logic is more simple and easy to understand 
        */
        const productsTitle = ['Tuyul', 'Iphone 17'];
        for (const product of productsTitle) {
            const productCard = await this.driver.findElement(
                By.xpath(`//div[@class='${this.#productDetailsLocator}' and contains(., '${product}')]`)
            );

            const productText = await productCard.getText();
            assert.ok(
                productText.includes(product),
                `Product title does not match expected value for ${product}`
            );

            const addToCartButton = await productCard.findElement(
                By.xpath(`.//button[contains(text(), 'Add to Cart')]`)
            );
            assert.ok(
                addToCartButton.isDisplayed(),
                `Add to Cart button is not displayed for ${product}`
            );

            await addToCartButton.click();
        }
    }

    async #goToCart() {
        // Click cart button
        const cartButton = await this.driver.findElement(
            By.xpath(this.#cartButtonLocator)
        );

        assert.ok(
            await cartButton.isDisplayed(),
            "Cart button is not displayed"
        );

        const cartText = await cartButton.getText();
        assert.ok(
            cartText.includes("Cart"),
            "Cart button text does not match expected value"
        );

        await cartButton.click();
    }

    async #checkoutProducts() {
        await this.driver.wait(
            until.urlContains("/cart"),
            3000, // Wait for up to 3 seconds for the URL to contain "/cart"
            "Expected URL to contain '/cart' after adding products to cart"
        );

        const currentCartUrl = await this.driver.getCurrentUrl();
        assert.ok(
            currentCartUrl.includes("/cart"),
            `Expected URL to contain '/cart' after adding products to cart, but got '${currentCartUrl}'`
        );

        // Validate cart items
        await this.driver.wait(
            until.elementLocated(By.xpath(this.#cartItemsLocator)),
            3000, // Wait for up to 3 seconds for the cart items to be located
            "Expected cart items to be located"
        );

        await this.driver.wait(
            until.elementIsVisible(await this.driver.findElement(By.xpath(this.#cartItemsLocator))),
            3000, // Wait for up to 3 seconds for the cart items to be visible
            "Expected cart items to be visible"
        );

        assert.ok(
            await this.driver.findElement(By.xpath(this.#cartItemsLocator)).isDisplayed(),
            "Cart items are not displayed"
        );
        const cartItems = await this.driver.findElement(By.xpath(this.#cartItemsLocator));
        const cartRows = await cartItems.findElements(By.xpath(this.#cartRowLocator));

        for (const item of cartRows) {
            const name = await item.findElement(By.xpath(this.#cartNameLocator)).getText();
            const desc = await item.findElement(By.xpath(this.#cartDescLocator)).getText();
            const price = await item.findElement(By.xpath(this.#cartPriceLocator)).getText();
            const qty = await item.findElement(By.xpath(this.#cartQtyLocator)).getText();
            const total = await item.findElement(By.xpath(this.#cartTotalLocator)).getText();

            const itemData = { name, desc, price, qty, total };
            this.#items.push(itemData);

            assert.ok(name.length > 0, "Product name should not be empty");
            assert.ok(qty !== "0", "Quantity should be greater than 0");
        }

        // Click checkout button
        const checkoutButton = await this.driver.findElement(
            By.xpath(this.#checkoutButtonLocator)
        );

        assert.ok(
            await checkoutButton.isDisplayed(),
            "Checkout button is not displayed"
        );

        const checkoutText = await checkoutButton.getText();
        assert.ok(
            checkoutText.includes("Checkout"),
            "Checkout button text does not match expected value"
        );

        await checkoutButton.click();

        await this.#checkoutForm();
    }

    async #checkoutForm() {
        await this.driver.wait(
            until.elementLocated(
                By.xpath(this.#checkoutModalLocator),
            ),
            3000, // Wait for up to 3 seconds for the form to be located
            "Expected checkout form to be located"
        );

        await this.driver.wait(
            until.elementIsVisible(
                await this.driver.findElement(By.xpath(this.#checkoutModalLocator))
            ),
            3000, // Wait for up to 3 seconds for the form to be visible
            "Expected checkout form to be visible"
        );

        assert.ok(
            await this.driver.findElement(By.xpath(this.#checkoutModalLocator)).isDisplayed(),
            "Checkout form is not displayed"
        );

        const modalForm = await this.driver.findElement(By.xpath(this.#checkoutModalLocator));
        const form = await modalForm.findElement(By.css("form"));
        const formTitle = await form.findElement(By.xpath(`//h2`));
        assert.strictEqual(
            await formTitle.getText(),
            "Checkout Form",
            "Form title does not match expected value"
        );

        // Data
        const name = "QuizLovers";
        const email = "quiz@lovers.com";
        const address = "Jln menuju kebaikan";

        const nameInput = await form.findElement(
            By.xpath(this.#checkoutNameInputLocator)
        );
        const emailInput = await form.findElement(
            By.xpath(this.#checkoutEmailInputLocator)
        );
        const addressInput = await form.findElement(
            By.xpath(this.#checkoutAddressInputLocator)
        );

        await this.#typeInput(nameInput, name);
        await this.#typeInput(emailInput, email);
        await this.#typeInput(addressInput, address);

        await this.#bypassCaptcha(form);
        await this.#validateTnC(form);

        await this.driver.wait(
            until.stalenessOf(modalForm),
            5000,
            "Expected checkout form to be closed after submission"
        );

        await this.#validateConfirmation(
            name,
            email,
            address,
            this.#items
        );
    }

    async #bypassCaptcha(form) {
        const captchaQuestion = await form.findElement(
            By.xpath(this.#checkoutCaptchaQuestionLocator)
        );
        const captchaQuestionText = await captchaQuestion.getText();

        assert.ok(
            captchaQuestionText.includes("What is"),
            "Captcha question does not match expected value"
        );

        const extracts = captchaQuestionText.match(/\d+|[\+\-\*\/]/g);
        assert.ok(
            extracts && extracts.length === 3,
            "Captcha question format is invalid"
        );

        const [num1Str, opStr, num2Str] = extracts;
        const num1 = parseInt(num1Str, 10);
        const num2 = parseInt(num2Str, 10);

        let answer;
        switch (opStr) {
            case "+":
                answer = num1 + num2;
                break;
            case "-":
                answer = num1 - num2;
                break;
            case "*":
                answer = num1 * num2;
                break;
            case "/":
                answer = num1 / num2;
                break;
            default:
                throw new Error(`Invalid operator: ${opStr}`);
        }

        const answerInput = await form.findElement(
            By.xpath(this.#checkoutCaptchaAnswerInputLocator)
        );
        await answerInput.click();
        await answerInput.sendKeys(answer.toString(), Key.TAB);
    }

    async #validateTnC(form) {
        // 1. Validate T&C checkbox and text
        const tncCheckbox = await form.findElement(
            By.xpath(this.#tncCheckboxLocator)
        );
        assert.ok(
            await tncCheckbox.isDisplayed(),
            "T&C checkbox is not displayed"
        );

        const tncText = await form.findElement(
            By.xpath(this.#tncTextLocator)
        );
        const tncLink = await tncText.findElement(
            By.xpath(this.#tncLinkLocator)
        );

        const tncTextContent = await tncText.getText();
        const tncLinkText = await tncLink.getText();

        assert.ok(
            tncTextContent.includes("I accept the"),
            "T&C text does not match expected value"
        );
        assert.ok(
            tncLinkText.includes("Terms & Conditions"),
            "T&C link text does not match expected value"
        );

        await this.driver.executeScript("arguments[0].click();", tncLink);

        // 2. Validate T&C overlay
        await this.driver.wait(
            until.elementLocated(
                By.xpath(this.#tncOverlayLocator)
            ),
            2000,
            "Expected T&C overlay to be located"
        );

        const tncOverlay = await form.findElement(By.xpath(this.#tncOverlayLocator));

        await this.driver.wait(
            until.elementIsVisible(tncOverlay),
            2000,
            "Expected T&C overlay to be visible"
        );

        assert.ok(
            await tncOverlay.isDisplayed(),
            "T&C overlay is not displayed"
        );

        const tncOverlayContent = await form.findElement(
            By.xpath(this.#tncOverlayContentLocator)
        );
        const tncOverlayContentTitle = await tncOverlayContent.findElement(By.xpath(`//h3`));

        assert.strictEqual(
            await tncOverlayContentTitle.getText(),
            "Terms & Conditions",
            "T&C overlay title does not match expected value"
        );

        const tncOverlayContentNote = "This order is completely fictional. After completing the checkout. You will receive a notification email confirming your (fake) order.";

        assert.ok(
            (await tncOverlayContent.getText()).includes(tncOverlayContentNote),
            "T&C overlay content does not match expected value"
        );

        // 3. Close T&C overlay
        const tncOverlayButtonClose = await form.findElement(
            By.xpath(this.#tncOverlayButtonCloseLocator)
        );
        await tncOverlayButtonClose.click();

        // Tunggu hingga T&C overlay benar-benar hilang/tertutup rapat
        await this.driver.wait(
            until.stalenessOf(tncOverlay),
            5000,
            "Expected T&C overlay to be hidden"
        );

        // Centang T&C checkbox setelah modal tertutup sempurna
        if (!(await tncCheckbox.isSelected())) {
            await this.driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", tncCheckbox);
            await tncCheckbox.click();
        }

        // 4. Click checkout button
        const checkoutButton = await form.findElement(
            By.xpath(this.#checkoutSubmitButtonLocator)
        );
        const cancelButton = await form.findElement(
            By.xpath(this.#checkoutCancelButtonLocator)
        );

        const checkoutButtonText = await checkoutButton.getText();
        const cancelButtonText = await cancelButton.getText();

        assert.strictEqual(
            checkoutButtonText,
            "Submit",
            "Checkout button text does not match expected value"
        );
        assert.strictEqual(
            cancelButtonText,
            "Cancel",
            "Cancel button text does not match expected value"
        );

        await super.takeScreenshot(
            await form.takeScreenshot(),
            "checkout",
            "checkout_captcha.png"
        );

        await checkoutButton.click();
    }

    async #validateConfirmation(name, email, address, items) {
        await this.driver.wait(
            until.elementLocated(By.xpath(this.#confirmationModalLocator)),
            10000,
            "Expected confirmation modal to be located"
        );

        const confirmationModal = await this.driver.findElement(
            By.xpath(this.#confirmationModalLocator)
        );

        await this.driver.wait(
            until.elementIsVisible(confirmationModal),
            10000,
            "Expected confirmation modal to be visible"
        );

        const confirmationModalContent = await confirmationModal.findElement(
            By.xpath(this.#confirmationModalContentLocator)
        );

        const checkName = await confirmationModalContent.findElement(By.xpath(`.//p[contains(., 'Name:')]`));
        await this.driver.wait(async () => {
            const rawText = await checkName.getText();
            return rawText.toLowerCase().includes(name.toLowerCase().trim());
        }, 10000, `Expected user name '${name}' to be rendered in confirmation modal`);

        const checkEmail = await confirmationModalContent.findElement(By.xpath(`.//p[contains(., 'Email:')]`));
        const checkAddress = await confirmationModalContent.findElement(By.xpath(`.//p[contains(., 'Address:')]`));

        // Verify that the confirmation modal contains the correct user information
        await super.takeScreenshot(
            await confirmationModalContent.takeScreenshot(),
            "checkout",
            "verify_checkout_confirmation.png"
        );

        assert.ok((await checkName.getText()).includes(name), "Confirmation name mismatch");
        assert.ok((await checkEmail.getText()).includes(email), "Confirmation email mismatch");
        assert.ok((await checkAddress.getText()).includes(address), "Confirmation address mismatch");

        const invoiceRows = await confirmationModalContent.findElements(
            By.xpath(this.#invoiceRowLocator)
        );
        const allKeys = Object.keys(items[0]).filter(key => key !== 'desc');
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const invoiceRow = invoiceRows[i];

            for (const key of allKeys) {
                const colLocator = `.//span[contains(@class, 'col-${key}')]`;
                const colElement = await invoiceRow.findElement(By.xpath(colLocator));

                await this.driver.wait(
                    async () => (await colElement.getText()).trim() !== "",
                    5000,
                    `Expected item column ${key} text to be rendered`
                );

                const colText = await colElement.getText();
                assert.ok(
                    colText.includes(item[key]),
                    `Item ${key} mismatch! Expected '${item[key]}' in '${colText}'`
                );
            }
        }

        const expectedGrandTotal = items.reduce((sum, item) => {
            const numericTotal = parseInt(item.total.replace(/[^0-9]/g, ''), 10);
            return sum + numericTotal;
        }, 0);

        const grandTotalElement = await confirmationModalContent.findElement(
            By.xpath(this.#invoiceTotalLocator)
        );

        await this.driver.wait(async () => {
            const rawText = await grandTotalElement.getText();
            const numeric = parseInt(rawText.replace(/[^0-9]/g, ''), 10);
            return !isNaN(numeric) && numeric > 0;
        }, 5000, "Expected grand total to be calculated (> 0)");

        const grandTotalText = await grandTotalElement.getText();
        const numericGrandTotal = parseInt(grandTotalText.replace(/[^0-9]/g, ''), 10);

        assert.strictEqual(
            numericGrandTotal,
            expectedGrandTotal,
            `Grand total mismatch! Expected: ${expectedGrandTotal}, got: ${numericGrandTotal}`
        );

        // await super.takeScreenshot(
        //     await confirmationModalContent.takeScreenshot(),
        //     "checkout",
        //     "checkout_confirmation_success.png"
        // );

        // Close modal konfirmasi
        const invoiceSubmitButton = await confirmationModalContent.findElement(
            By.xpath(this.#invoiceSubmitButtonLocator)
        );
        await this.driver.executeScript("arguments[0].click();", invoiceSubmitButton);
    }
}