import { BaseScreenshot } from "./base.screenshot.js";

export class BasePage extends BaseScreenshot {
    constructor(driver, folderName) {
        super(folderName);
        this.driver = driver;
    }

    async open(url) {
        await this.driver.get(url);
    }

    async quit() {
        if (this.driver) {
            await this.driver.quit();
        }
    }
}