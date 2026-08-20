# Belajar Bareng E2E Test Automation

An end-to-end test suite for the [Belajar Bareng](https://belajar-bareng.onrender.com) practice application. The project uses Selenium WebDriver and Mocha to test the main user journey:

`login -> add user -> shop -> cart -> checkout`

The suite follows a Page Object Model structure and includes negative tests, boundary checks, screenshot capture, and Mochawesome HTML reporting. It was created for the Digital Skola QA Bootcamp, Session 8.

## Tech Stack

- Node.js with ECMAScript modules (`"type": "module"`)
- [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver) `^4.46.0`
- [Mocha](https://mochajs.org/) `^11.7.6`
- [Mochawesome](https://www.npmjs.com/package/mochawesome) `^8.0.1`
- Google Chrome and Selenium's Chrome driver

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
│       └── screenshots/            # Generated screenshots
├── mochawesome-report/            # Generated HTML and JSON reports
├── package.json
└── README.md
```

## Prerequisites

- Node.js supported by Mocha 11: `^18.18.0`, `^20.9.0`, or `>=21.1.0`
- Google Chrome installed and available to Selenium WebDriver
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

Run the Belajar Bareng suite:

```bash
npm run test:belajar-bareng
```

Run the suite and generate a Mochawesome report:

```bash
npm run test:belajar-bareng:report
```

The report is generated in `mochawesome-report/`. Open `mochawesome-report/mochawesome.html` in a browser to view it.

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

The current test data uses `QuizLovers` without spaces. The source code and latest report contain no `Quiz Lovers` test value or username-space normalization issue. A dedicated username-with-spaces scenario has not been added, so space handling is not currently covered by the suite.

### Checkout

Implemented in `tests/belajar-bareng/modules/checkout.test.js` and `src/modules/checkout.js`:

- Verifies the Shop page at `/Shop`.
- Adds the `Tuyul` and `Iphone 17` products to the cart.
- Validates cart item details and quantities.
- Opens the checkout form and fills in name, email, and address.
- Solves the arithmetic CAPTCHA.
- Opens and validates the Terms & Conditions overlay.
- Submits the order and validates the confirmation details, invoice items, and total.

## Current Test Status

The latest documented report contains **14 passing**, **3 skipped**, and **0 failing** tests out of 17.

| Suite | Passing | Skipped | Failing |
|---|---:|---:|---:|
| Login Page Functionality | 6 | 1 | 0 |
| Add Users Page Functionality | 7 | 2 | 0 |
| Checkout Page Functionality | 1 | 0 | 0 |
| **Total** | **14** | **3** | **0** |

Skipped tests use Mocha's `it.skip()` so known application issues remain visible in the report without stopping the full suite.

## Known Application Issues

| Scenario | Expected | Actual | Test status |
|---|---|---|---|
| Login page verification | Page title `Login - User Management` and form title `Sign In` | Page title `User Management` and form title `Sing in` | Skipped |
| Add user with age `0` | Clear `Age cannot be negative.` validation | The toast content is garbled or combines multiple messages | Skipped |
| Duplicate username | Clear duplicate-user message | The toast content is garbled or combines multiple messages | Skipped |
| Shop route | Lowercase `/shop` | Application uses `/Shop` | Assertion follows current behavior |

## Implementation Notes

- `BasePage.toastElement()` waits for a toast, validates its text, optionally captures a screenshot, and waits for the toast to disappear.
- `BaseScreenshot` writes screenshots to `tests/<suite>/screenshots/<folder>/<fileName>` and creates missing directories automatically.
- `BelajarBareng` shares one Selenium driver across the Login, Add Users, and Checkout page objects.
- The main suite creates a Chrome driver in `tests/belajar-bareng/index.test.js` and closes it after the suite finishes.