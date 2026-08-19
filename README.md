# Belajar Bareng – E2E Test Automation

Automated end-to-end test suite for the **Belajar Bareng** practice application (`https://belajar-bareng.onrender.com/`), built with Selenium WebDriver and Mocha. It exercises the full user journey — **login → add user → checkout** — using a Page Object Model architecture, with screenshot capture and HTML test reporting.

> Built as part of Digital Skola QA Bootcamp coursework (Session 8).

## Tech Stack

- Node.js (ESM — `"type": "module"`)
- [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver) `^4.46.0`
- [Mocha](https://mochajs.org/) `^11.7.6` — test runner
- [Mochawesome](https://www.npmjs.com/package/mochawesome) — HTML test report
- mocha-simple-html-reporter — lightweight HTML reporter

## Project Structure

```
.
├── src/
│   ├── belajar.bareng.js       # Composes all page modules into a single entry point
│   ├── core/
│   │   ├── base.driver.js      # BasePage: open(url), quit()
│   │   └── base.screenshot.js  # BaseScreenshot: takeScreenshot(buffer, folder, fileName)
│   └── modules/
│       ├── index.js            # Barrel export (LoginPage, AddUsers, Checkout)
│       ├── login.js            # LoginPage: open() + loginForm()
│       ├── add.users.js        # AddUsers: goToAddUserPage() + addUserForm()
│       └── checkout.js         # Checkout: checkout() → addToCart → cart → checkout form → confirmation
└── tests/
    ├── google.test.js          # Smoke/dummy test against saucedemo.com
    └── belajar-bareng/
        ├── index.test.js       # Suite bootstrap (Builder, shared testContext)
        ├── modules/
        │   ├── login.test.js       # Full flow: login → add user → checkout
        │   └── add.users.test.js   # Standalone add-user navigation test (skipped)
        └── screenshots/
            └── login/login_page_success.png
```

## Prerequisites

- Node.js `^18.18.0 || ^20.9.0 || >=21.1.0` (required by Mocha 11)
- Google Chrome installed (driven via `selenium-webdriver`'s ChromeDriver)

## Installation

```bash
npm install
```

## Running Tests

```bash
# Dummy/smoke test (login flow on saucedemo.com)
npm run test:dummy

# Full Belajar Bareng E2E suite
npm run test:belajar-bareng

# Full suite with an HTML (mochawesome) report
npm run test:belajar-bareng:report
```

Reports are generated to `mochawesome-report/` — open `mochawesome-report/mochawesome.html` in a browser to view results.

## Test Results

Latest `test:belajar-bareng:report` run — **5 passing** in ~16s:

| # | Test | Status | Duration |
|---|---|---|---|
| 1 | Should return true when navigating to login page. Page title should be `'Login - User Management'`, page URL should be `'https://belajar-bareng.onrender.com/'` and on the page should be the login form | ✅ Pass | 5744ms |
| 2 | Should login successfully | ✅ Pass | 243ms |
| 3 | Should go to the users page | ✅ Pass | 759ms |
| 4 | Should add a new user successfully | ✅ Pass | 5923ms |
| 5 | User should be able to checkout | ✅ Pass | 2231ms |

Report artifacts:
- `mochawesome-report/mochawesome.json`
- `mochawesome-report/mochawesome.html`

## Test Coverage — Belajar Bareng Suite

1. **Login**
   - Opens the base URL, validates page title, URL, and that the login form is rendered (screenshot captured on both success and failure).
   - Logs in using the on-page credential hint button when no username/password is supplied.

2. **Add User**
   - Navigates to `/users`, opens the "Add User" form, submits a new user (username + age), and validates the success toast message.

3. **Checkout**
   - Adds two products ("Tuyul", "Iphone 17") to the cart.
   - Opens the cart and validates each line item (name, price, qty, total).
   - Proceeds to checkout: fills name/email/address, solves the arithmetic captcha, opens and verifies the Terms & Conditions overlay content, accepts it, and submits.
   - Validates the confirmation invoice — customer details, line items, and grand total — against the cart data collected earlier in the flow.

## Known Bugs Documented in Tests

The suite intentionally asserts against the application's *actual* (buggy) behavior, with the originally expected/correct behavior left commented out in the source for reference:

| Location | Expected | Actual (asserted in test) |
|---|---|---|
| `src/modules/login.js` | Form title `"Sign In"` | Form title `"Sing in"` (typo) |
| `src/modules/add.users.js` | Toast: `"User successfully added, Hi Quiz User!"` | Username spaces are stripped: `"User successfully added, Hi QuizUser!"` |
| `src/modules/checkout.js` | Cart route `/shop` (lowercase) | Route is capitalized: `/Shop` |

## Notes

- `tests/belajar-bareng/modules/add.users.test.js` is currently disabled (`it.skip`), pending further work.
- Screenshots are written to `tests/<folderName>/screenshots/<subfolder>/<fileName>` via `BaseScreenshot`.
- `AddUsersTest` in `index.test.js` is currently commented out — only `LoginTest` (which covers the full login → add user → checkout flow) runs by default.