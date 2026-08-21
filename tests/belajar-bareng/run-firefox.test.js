import { BelajarBarengTest } from "./index.test.js";
import * as firefox from "selenium-webdriver/firefox.js";

const testContext = {};
const options = new firefox.Options();

// Menjalankan tanpa GUI
options.addArguments("--headless");

// Optimasi performa melalui Firefox Preferences (about:config)
options.setPreference("browser.cache.disk.enable", false);
options.setPreference("browser.cache.memory.enable", false);
options.setPreference("browser.cache.offline.enable", false);
options.setPreference("network.http.use-cache", false);

// Mematikan telemetri dan laporan kerusakan
options.setPreference("toolkit.telemetry.reportingpolicy.firstRun", false);
options.setPreference("toolkit.telemetry.enabled", false);
options.setPreference("toolkit.telemetry.unified", false);
options.setPreference("datareporting.healthreport.uploadEnabled", false);
options.setPreference("datareporting.policy.dataSubmissionEnabled", false);

// Mematikan auto-update
options.setPreference("app.update.auto", false);
options.setPreference("app.update.enabled", false);

// Membatasi konsumsi RAM dengan mengurangi jumlah proses (opsional untuk memori terbatas)
options.setPreference("dom.ipc.processCount", 1);

new BelajarBarengTest(testContext, "firefox", options).run();