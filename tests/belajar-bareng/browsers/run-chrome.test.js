import { Browser } from "selenium-webdriver";
import { BelajarBarengTest } from "../index.test.js";
import * as chrome from "selenium-webdriver/chrome.js";

const testContext = {};
const options = new chrome.Options();
const isHeadless = process.env.HEADLESS === 'true';

if (isHeadless) {
    options.addArguments("--headless=new");
}

// Configurasi main performance settings
options.addArguments("--disable-gpu");

// Setup optimasi performa ekstra
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--disable-extensions");
options.addArguments("--no-sandbox");
options.addArguments("--disable-smooth-scrolling");
options.addArguments("--disable-background-networking");
options.addArguments("--mute-audio");

new BelajarBarengTest(testContext, Browser.CHROME, options).run();