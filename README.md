# Belajar Bareng E2E Test Automation

An end-to-end test suite for the [Belajar Bareng](https://belajar-bareng.onrender.com) practice application. The project uses Selenium WebDriver and Mocha to test the main user journey:

`login -> add user -> shop -> cart -> checkout`

The suite follows a Page Object Model structure and includes negative tests, boundary checks, browser-specific screenshot capture, and Mochawesome reporting. The same suite can run on Chrome, Firefox, and Microsoft Edge, either individually or in parallel. It was created for the Digital Skola QA Bootcamp, Session 8.

## Tech Stack

- Node.js with ECMAScript modules (`"type": "module"`)
- [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver) `^4.46.0`
- [Mocha](https://mochajs.org/) `^11.7.6`
- [Mochawesome](https://www.npmjs.com/package/mochawesome) `^8.0.1`
- `cross-env` for browser environment variables
- `concurrently` for parallel browser execution
- `mochawesome-merge` and `mochawesome-report-generator` for combined reports
- Google Chrome, Mozilla Firefox, and Microsoft Edge with their Selenium drivers

## Project Structure

```text
.
├── src/
│   ├── belajar.bareng.js          # Composes the page objects into BelajarBareng
│   ├── core/
│   │   ├── base.driver.js         # Shared navigation, driver, and toast helpers
│   │   └── base.screenshot.js     # Shared screenshot file handling
│   └── modules/
│       ├── index.js               # Page object barrel export
│       ├── login.js               # Login page object
│       ├── add.users.js           # Add user page object
│       └── checkout.js             # Shop, cart, and checkout page object
├── tests/
│   ├── google.test.js             # Separate smoke test for SauceDemo
│   └── belajar-bareng/
│       ├── index.test.js          # WebDriver and shared test context setup
│       ├── modules/
│       │   ├── index.test.js      # Test class barrel export
│       │   ├── login.test.js      # Login scenarios
│       │   ├── add.users.test.js  # Add user scenarios
│       │   └── checkout.test.js   # Checkout happy path
│       └── screenshots/            # Generated screenshots grouped by browser
├── reports/
│   ├── json/                       # Per-browser Mochawesome JSON reports
│   ├── combined-report.json       # Merged report input
│   └── parallel-compatibility-report.html
│                                   # Combined compatibility report
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

Run the Belajar Bareng suite in the default browser (Chrome):

```bash
npm run test:belajar-bareng
```

Run the suite in a specific browser and save its JSON report:

```bash
npm run test:chrome
npm run test:firefox
npm run test:edge
```

Run Chrome, Firefox, and Microsoft Edge in parallel, then merge and generate the combined report:

```bash
npm run test:parallel
```

The parallel workflow writes per-browser JSON files to `reports/json/`, merges them into `reports/combined-report.json`, and generates `reports/parallel-compatibility-report.html`.

To generate a report manually from existing JSON files:

```bash
npm run report:merge
npm run report:generate
```

## Test Coverage

### Login

Implemented in `tests/belajar-bareng/modules/login.test.js` and `src/modules/login.js`:

- Opens the application and checks the base URL and page title.
- Submits empty credentials and checks the browser's required-field validation.
- Submits a username without a password and checks password validation.
- Submits invalid credentials and checks the error toast.
- Reads the valid credentials from the application's hint button and verifies successful login.
- Navigates to the users page at `/users`.

The dedicated login page verification is currently skipped because the expected page/form titles do not match the application.

### Add User

Implemented in `tests/belajar-bareng/modules/add.users.test.js` and `src/modules/add.users.js`:

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

Implemented in `tests/belajar-bareng/modules/checkout.test.js` and `src/modules/checkout.js`:

- Verifies the Shop page at `/Shop`.
- Adds the `Tuyul` and `Iphone 17` products to the cart.
- Validates cart item details and quantities.
- Opens the checkout form and fills in name, email, and address.
- Solves the arithmetic CAPTCHA.
- Opens and validates the Terms & Conditions overlay.
- Submits the order and validates the confirmation details, invoice items, and total.

The checkout scenario is currently marked as unstable in the test suite because `confirmation data may be empty during Firefox execution.`

## Current Test Status

The latest parallel compatibility reports contain **13 passing**, **4 pending**, and **0 failing** tests per browser, for 17 tests per browser.

| Browser | Tests | Passing | Pending | Failing |
|---|---:|---:|---:|---:|
| Chrome | 17 | 13 | 4 | 0 |
| Firefox | 17 | 13 | 4 | 0 |
| Microsoft Edge | 17 | 13 | 4 | 0 |

The pending scenarios in the generated reports are the login page verification, age-zero add-user, duplicate-username, and checkout scenarios. The report status should be treated as a snapshot of the latest parallel run.

## Known Application Issues

| Scenario | Expected | Actual | Test status |
|---|---|---|---|
| Login page verification | Page title `Login - User Management` and form title `Sign In` | Page title `User Management` and form title `Sing in` | Skipped |
| Add user with age `0` | Clear `Age cannot be negative.` validation | The toast content is garbled or combines multiple messages | Skipped |
| Duplicate username | Clear duplicate-user message | The toast content is garbled or combines multiple messages | Skipped |
| Shop route | Lowercase `/shop` | Application uses `/Shop` | Assertion follows current behavior |
| Checkout confirmation in Firefox | Confirmation data is always populated | Confirmation data may be empty during Firefox execution | Pending / unstable |

## Implementation Notes

- `BasePage.toastElement()` waits for a toast, validates its text, optionally captures a screenshot, and waits for the toast to disappear.
- `BaseScreenshot` writes screenshots to `tests/<suite>/screenshots/<browser>/<folder>/<fileName>` and creates missing directories automatically.
- `BelajarBareng` shares one Selenium driver across the Login, Add Users, and Checkout page objects.
- The browser is selected through the `BROWSER` environment variable and defaults to `chrome`.
- The main suite creates the selected browser driver in `tests/belajar-bareng/index.test.js` and closes it after the suite finishes.
- Browser-specific screenshots are stored under `tests/belajar-bareng/screenshots/chrome/`, `firefox/`, or `microsoftedge/`.