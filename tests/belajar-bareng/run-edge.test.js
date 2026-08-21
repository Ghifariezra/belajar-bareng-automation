import { BelajarBarengTest } from "./index.test.js";
import * as edge from "selenium-webdriver/edge.js";

const testContext = {};
const options = new edge.Options();
const isHeadless = process.env.HEADLESS === 'true';

if (isHeadless) {
    options.addArguments("--headless=new");
}

// Konfigurasi performa utama
options.addArguments("--disable-gpu");

// Setup optimasi performa ekstra (berbasis Chromium)
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--no-sandbox");
options.addArguments("--disable-extensions");
options.addArguments("--disable-smooth-scrolling");
options.addArguments("--disable-background-networking");
options.addArguments("--mute-audio");

new BelajarBarengTest(testContext, "MicrosoftEdge", options).run();