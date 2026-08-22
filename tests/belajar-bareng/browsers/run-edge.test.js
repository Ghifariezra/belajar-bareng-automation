import { Browser } from "selenium-webdriver";
import { runBelajarBarengTests } from "../index.test.js";
import * as edge from "selenium-webdriver/edge.js";

const options = new edge.Options();
const isHeadless = process.env.HEADLESS === 'true';

if (isHeadless) {
    options.addArguments("--headless=new");
}

options.addArguments("--disable-gpu");
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--no-sandbox");
options.addArguments("--disable-extensions");
options.addArguments("--disable-smooth-scrolling");
options.addArguments("--disable-background-networking");
options.addArguments("--mute-audio");

runBelajarBarengTests(Browser.EDGE, options);