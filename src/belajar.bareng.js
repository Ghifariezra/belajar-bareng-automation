import { 
    LoginPage,
    DashboardPage,
    CheckoutPage
 } from "./pages/index.js";

export class BelajarBareng {
    constructor(driver, folderName, browser) {
        this.driver = driver;
        this.login = new LoginPage(driver, folderName, browser);
        this.dashboard = new DashboardPage(driver, folderName, browser);
        this.checkout = new CheckoutPage(driver, folderName, browser);
    }

    async open(url) {
        await this.driver.get(url);
    }
}