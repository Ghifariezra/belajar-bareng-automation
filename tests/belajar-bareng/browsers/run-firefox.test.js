import { Browser } from "selenium-webdriver";
import { BelajarBarengTest } from "../index.test.js";
import * as firefox from "selenium-webdriver/firefox.js";

const testContext = {};
const options = new firefox.Options();
const isHeadless = process.env.HEADLESS === 'true';

if (isHeadless) {
    options.addArguments("--headless");
}

// Optimize performance through Firefox Preferences (about:config)
options.setPreference("browser.cache.disk.enable", false);
options.setPreference("browser.cache.memory.enable", false);
options.setPreference("browser.cache.offline.enable", false);
options.setPreference("network.http.use-cache", false);

// Disable telemetry and crash reporting
options.setPreference("toolkit.telemetry.reportingpolicy.firstRun", false);
options.setPreference("toolkit.telemetry.enabled", false);
options.setPreference("toolkit.telemetry.unified", false);
options.setPreference("datareporting.healthreport.uploadEnabled", false);
options.setPreference("datareporting.policy.dataSubmissionEnabled", false);

// Disable auto-update
options.setPreference("app.update.auto", false);
options.setPreference("app.update.enabled", false);

// Limit RAM consumption by reducing the number of processes (optional for limited memory)
options.setPreference("dom.ipc.processCount", 1);

new BelajarBarengTest(testContext, Browser.FIREFOX, options).run();