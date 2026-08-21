import { LoginPage, AddUsers, Checkout } from "./modules/index.js";

export class BelajarBareng {
    constructor(driver, folderName, browser) {
        this.driver = driver;
        this.loginPage = new LoginPage(driver, folderName, browser);
        this.addUsers = new AddUsers(driver, folderName, browser);
        this.checkout = new Checkout(driver, folderName, browser);
    }
}