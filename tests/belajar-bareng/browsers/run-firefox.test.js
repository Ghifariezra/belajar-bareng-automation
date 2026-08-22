import { Browser } from "selenium-webdriver";
import { runBelajarBarengTests } from "../index.test.js";
import * as firefox from "selenium-webdriver/firefox.js";

const options = new firefox.Options();
const isHeadless = process.env.HEADLESS === 'true';

if (isHeadless) {
    options.addArguments("--headless");
}

options.setPreference("browser.cache.disk.enable", false);
options.setPreference("browser.cache.memory.enable", false);
options.setPreference("browser.cache.offline.enable", false);
options.setPreference("network.http.use-cache", false);

options.setPreference("toolkit.telemetry.reportingpolicy.firstRun", false);
options.setPreference("toolkit.telemetry.enabled", false);
options.setPreference("toolkit.telemetry.unified", false);
options.setPreference("datareporting.healthreport.uploadEnabled", false);
options.setPreference("datareporting.policy.dataSubmissionEnabled", false);

options.setPreference("app.update.auto", false);
options.setPreference("app.update.enabled", false);
options.setPreference("dom.ipc.processCount", 1);

runBelajarBarengTests(Browser.FIREFOX, options);