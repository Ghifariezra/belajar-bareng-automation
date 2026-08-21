import { BelajarBarengTest } from "./index.test.js";
import * as chrome from "selenium-webdriver/chrome.js";

const testContext = {};
const options = new chrome.Options();

// Konfigurasi performa utama
options.addArguments("--headless=new");
options.addArguments("--disable-gpu");

// Setup optimasi performa ekstra
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--disable-extensions");
options.addArguments("--no-sandbox");
options.addArguments("--disable-smooth-scrolling");
options.addArguments("--disable-background-networking");
options.addArguments("--mute-audio");

new BelajarBarengTest(testContext, "chrome", options).run();