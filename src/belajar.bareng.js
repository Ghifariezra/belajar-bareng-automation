import { LoginPage, AddUsers, Checkout } from "./modules/index.js";

export class BelajarBareng {
    constructor(driver, folderName) {
        this.driver = driver;
        this.loginPage = new LoginPage(driver, folderName);
        this.addUsers = new AddUsers(driver, folderName);
        this.checkout = new Checkout(driver, folderName);
    }
}