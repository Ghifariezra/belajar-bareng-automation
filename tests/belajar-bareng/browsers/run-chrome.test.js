import { Browser } from "selenium-webdriver";
import { runBelajarBarengTests } from "../index.test.js";
import * as chrome from "selenium-webdriver/chrome.js";

const options = new chrome.Options();
const isHeadless = process.env.HEADLESS === 'true';

if (isHeadless) {
    options.addArguments("--headless=new");
}

options.addArguments("--disable-gpu");
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--disable-extensions");
options.addArguments("--no-sandbox");
options.addArguments("--disable-smooth-scrolling");
options.addArguments("--disable-background-networking");
options.addArguments("--mute-audio");

runBelajarBarengTests(Browser.CHROME, options);