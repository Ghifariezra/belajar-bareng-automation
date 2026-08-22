import { By } from "selenium-webdriver";

export const DashboardLocators = Object.freeze({
    formContainer: By.xpath("//div[@class='container']"),
    titleUsersCard: By.xpath('//*[@id="app"]/div/div/div/h2'),

    // Add User Form & Section
    addUser: {
        openButton: By.xpath("//button[@data-testid='add-button']"),
        titleCard: By.xpath('//*[@id="app"]/div/div/h2'),
        usernameInput: By.xpath("//input[@data-testid='username-input']"),
        ageInput: By.xpath("//input[@data-testid='age-input']"),
        submitButton: By.xpath("//button[@data-testid='submit-button']"),
    },

    // Navigation Buttons
    navigation: {
        shopButton: By.xpath('//button[@data-testid="shop-button"]'),
    },
});