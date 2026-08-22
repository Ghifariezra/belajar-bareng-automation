# Belajar Bareng E2E Test Automation

An end-to-end test suite for the [Belajar Bareng](https://belajar-bareng.onrender.com) practice application. The project uses Selenium WebDriver and Mocha to test the main user journey:

`login -> add user -> shop -> cart -> checkout`

The suite follows a Page Object Model structure and includes negative tests, boundary checks, browser-specific screenshot capture, and Mochawesome reporting. The same suite can run on Chrome, Firefox, and Microsoft Edge, either individually or in parallel. Individual browser commands run in headed mode by default, while the parallel command explicitly enables headless mode. It was created for the Digital Skola QA Bootcamp, Session 8.

## Tech Stack

- Node.js with ECMAScript modules (`"type": "module"`)
- [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver) `^4.46.0`
- [Mocha](https://mochajs.org/) `^11.7.6`
- [Mochawesome](https://www.npmjs.com/package/mochawesome) `^8.0.1`
- Browser-specific Selenium WebDriver options for Chrome, Firefox, and Microsoft Edge
- Mocha parallel mode for cross-browser execution
- Mochawesome for per-browser and combined HTML reports
- Google Chrome, Mozilla Firefox, and Microsoft Edge with their Selenium drivers

## Project Structure

```text
.
├── src/
│   ├── belajar.bareng.js          # Composes Login, Dashboard, and Checkout pages
│   ├── core/
│   │   ├── base.driver.js         # Shared navigation, driver, and toast helpers
│   │   └── base.screenshot.js     # Shared screenshot file handling
│   └── pages/
│       ├── index.js               # Page object barrel export
│       ├── login.page.js          # Login page object
│       ├── dashboard.page.js      # Users and Add Users page object
│       └── checkout.page.js       # Shop, cart, and checkout page object
├── tests/
│   ├── google.test.js             # Separate smoke test for SauceDemo
│   └── belajar-bareng/
│       ├── index.test.js          # Shared BelajarBarengTest runner
│       ├── browsers/
│       │   ├── run-chrome.test.js # Chrome runner; headless when HEADLESS=true
│       │   ├── run-firefox.test.js# Firefox runner; headless when HEADLESS=true
│       │   └── run-edge.test.js   # Edge runner; headless when HEADLESS=true
│       ├── modules/
│       │   ├── index.test.js      # Test class barrel export
│       │   ├── login.test.js      # Login scenarios
│       │   ├── dashboard.test.js  # Dashboard and Add User scenarios
│       │   └── checkout.test.js   # Checkout happy path
│       └── screenshots/            # Generated screenshots grouped by browser
├── reports/
│   ├── chrome-report.html         # Chrome test report
│   ├── firefox-report.html        # Firefox test report
│   ├── edge-report.html           # Microsoft Edge test report
│   ├── compatibility-report.html  # Combined parallel report
│   └── assets/                     # Mochawesome report assets
├── package.json
└── README.md
```

## Prerequisites

- Node.js supported by Mocha 11: `^18.18.0`, `^20.9.0`, or `>=21.1.0`
- At least one supported browser installed and available to Selenium WebDriver
- Chrome, Firefox, and Microsoft Edge installed for the parallel compatibility run
- Internet access to reach the Belajar Bareng and SauceDemo applications

## Installation

```bash
npm install
```

## Running Tests

Run the separate SauceDemo smoke test:

```bash
npm run test:dummy
```

Run the Belajar Bareng suite in headed Chrome by default and generate `reports/chrome-report.html`:

```bash
npm run test:chrome
```

Run the suite in an individual supported browser in headed mode by default:

```bash
npm run test:firefox
npm run test:edge
```

The individual report files are `reports/chrome-report.html`, `reports/firefox-report.html`, and `reports/edge-report.html`.

To run an individual browser in headless mode, set `HEADLESS=true` before running the command. For example:

```bash
npx cross-env HEADLESS=true npm run test:chrome
```

Run Chrome, Firefox, and Microsoft Edge in parallel and generate the compatibility report:

```bash
npm run test:parallel
```

The parallel workflow first removes the previous `reports/` directory, sets `HEADLESS=true` through `cross-env`, runs the three browser runner files with Mocha's `--parallel` option, and generates `reports/compatibility-report.html`. The parallel command is configured to generate HTML only. Open that file in a browser to review the cross-browser results.

## Test Coverage

### Login

Implemented in `tests/belajar-bareng/modules/login.test.js` and `src/pages/login.page.js`:

- Opens the application and checks the base URL and page title.
- Submits empty credentials and checks the browser's required-field validation.
- Submits a username without a password and checks password validation.
- Submits invalid credentials and checks the error toast.
- Reads the valid credentials from the application's hint button and verifies successful login.
- Navigates to the users page at `/users`.

The login page verification checks the current page title, URL, and form title. Failed tests capture screenshots under the browser-specific `login/bugs/` directory.

### Add User

Implemented in `tests/belajar-bareng/modules/dashboard.test.js` and `src/pages/dashboard.page.js`:

- Opens the Add Users page from the users page.
- Checks required-field validation for an empty username.
- Checks required-field validation when age is missing.
- Checks invalid username/age input handling.
- Verifies the username `maxlength` boundary of 10 characters.
- Adds a new user and checks the success toast.
- Navigates to the Shop page.

The age-zero and duplicate-username scenarios remain in the test source but are skipped because of application behavior described below.

The current test data uses `QuizLovers` without spaces. The source code and latest reports contain no `Quiz Lovers` test value or username-space normalization issue. A dedicated username-with-spaces scenario has not been added, so space handling is not currently covered by the suite.

### Checkout

Implemented in `tests/belajar-bareng/modules/checkout.test.js` and `src/pages/checkout.page.js`:

- Verifies the Shop page at `/Shop`.
- Adds the `Tuyul` and `Iphone 17` products to the cart.
- Validates cart item details and quantities.
- Opens the checkout form and fills in name, email, and address.
- Solves the arithmetic CAPTCHA.
- Opens and validates the Terms & Conditions overlay.
- Submits the order and validates the confirmation details, invoice items, and total.

The checkout suite is currently skipped for all browsers because the checkout flow is unstable and confirmation data may be empty during execution. The test remains available for future stabilization.

## Current Test Status

The generated compatibility report is the source of truth for the latest cross-browser test status. Because the report is regenerated by `npm run test:parallel`, its result counts may change between runs.

The report includes results for Chrome, Firefox, and Microsoft Edge. Known pending or unstable scenarios are described below.

## Known Application Issues

| Scenario | Expected | Actual | Test status |
|---|---|---|---|
| Login page verification | Current page title, base URL, and form title `Sign in` | Validated by the active login test | Active |
| Add user with age `0` | Clear `Age cannot be negative.` validation | The toast content is garbled or combines multiple messages | Skipped |
| Duplicate username | Clear duplicate-user message | The toast content is garbled or combines multiple messages | Skipped |
| Shop route | Lowercase `/shop` | Application uses `/Shop` | Assertion follows current behavior |
| Checkout confirmation | Confirmation data is always populated | Checkout flow may produce empty confirmation data | Skipped for all browsers |

## Implementation Notes

- `BasePage.toastElement()` waits for a toast, validates its text, optionally captures a screenshot, and waits for the toast to disappear.
- `BaseScreenshot` writes screenshots to `tests/<suite>/screenshots/<browser>/<folder>/<fileName>` and creates missing directories automatically.
- `BelajarBareng` shares one Selenium driver across the Login, Add Users, and Checkout page objects.
- Each browser runner in `tests/belajar-bareng/browsers/` passes its browser name and WebDriver options to `BelajarBarengTest` in `tests/belajar-bareng/index.test.js`.
- The main runner creates the configured browser driver and closes it after the suite finishes.
- Browser-specific screenshots are stored under `tests/belajar-bareng/screenshots/chrome/`, `firefox/`, or `microsoftedge/`. The screenshot location is independent of whether the browser runs in headed or headless mode.