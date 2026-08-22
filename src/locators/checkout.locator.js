import { By } from "selenium-webdriver";

export const CheckoutLocators = Object.freeze({
    pageTitle: By.xpath("//h1[@class='page-title']"),
    productDetails: By.className("card-details"),

    // Cart Section
    cart: {
        button: By.xpath("//div[@data-testid='cart-button']"),
        items: By.xpath("//div[@class='cart-items']"),
        row: By.xpath(".//div[contains(@class, 'cart-row')]"),
        name: By.xpath(".//span[starts-with(@data-testid, 'cart-name-')]"),
        desc: By.xpath(".//span[starts-with(@data-testid, 'cart-desc-')]"),
        price: By.xpath(".//span[starts-with(@data-testid, 'cart-price-')]"),
        qty: By.xpath(".//span[starts-with(@data-testid, 'cart-qty-')]"),
        total: By.xpath(".//span[starts-with(@data-testid, 'cart-total-')]"),
        checkoutButton: By.xpath("//button[@data-testid='checkout-button']"),
    },

    // Form Modal Section
    form: {
        modal: By.xpath("//div[@data-testid='checkout-form checkout-form-modal']"),
        nameInput: By.xpath(".//input[@data-testid='checkout-name']"),
        emailInput: By.xpath(".//input[@data-testid='checkout-email']"),
        addressInput: By.xpath(".//textarea[@data-testid='checkout-address']"),
        submitButton: By.xpath("//button[@data-testid='submit-checkout']"),
        cancelButton: By.xpath("//button[@data-testid='cancel-checkout']"),
    },

    // Captcha Section
    captcha: {
        question: By.xpath("//span[@data-testid='captcha-question']"),
        answerInput: By.xpath(".//input[@data-testid='checkout-captcha']"),
    },

    // Terms & Conditions Section
    tnc: {
        checkbox: By.xpath(".//input[@data-testid='tnc-checkbox']"),
        text: By.xpath("//span[@class='tnc-text']"),
        link: By.xpath("//span[@data-testid='tnc-link']"),
        overlay: By.xpath("//div[@class='modal-overlay-tnc']"),
        content: By.xpath("//div[@class='modal-content-tnc']"),
        closeButton: By.xpath("//button[@data-testid='tnc-ok-button']"),
    },

    // Confirmation Invoice Section
    confirmation: {
        modal: By.xpath("//div[@class='modal-overlay']"),
        content: By.xpath("//div[@class='modal-content confirmation-modal']"),
        invoiceRow: By.xpath(".//div[@class='invoice-row']"),
        invoiceTotal: By.xpath(".//h3[@data-testid='checkout-total']"),
        submitButton: By.xpath(".//button[@data-testid='checkout-success-ok-button']"),
    },
});