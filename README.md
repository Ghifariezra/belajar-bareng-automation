# Belajar Bareng – E2E Test Automation

Automated end-to-end test suite for the **Belajar Bareng** practice application (`https://belajar-bareng.onrender.com`), built with Selenium WebDriver and Mocha. It covers the full user journey — **login → add user → checkout** — including happy-flow, negative, and boundary scenarios, using a Page Object Model architecture with screenshot capture and HTML test reporting.

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
│   │   ├── base.driver.js      # BasePage: open(url), quit(), toastElement() — shared toast wait/assert/screenshot
│   │   └── base.screenshot.js  # BaseScreenshot: takeScreenshot(buffer, folder, fileName)
│   └── modules/
│       ├── index.js            # Barrel export (LoginPage, AddUsers, Checkout)
│       ├── login.js            # LoginPage: open() + loginForm() — empty/missing/invalid/valid flows
│       ├── add.users.js        # AddUsers: goToAddUserPage(), addUserForm() — empty/missing/invalid/age-zero/add/existing flows, goToShopPage()
│       └── checkout.js         # Checkout: checkout() → addToCart → cart → checkout form → confirmation
└── tests/
    ├── google.test.js          # Smoke/dummy test against saucedemo.com
    └── belajar-bareng/
        ├── index.test.js       # Suite bootstrap (Builder, shared testContext)
        ├── modules/
        │   ├── index.test.js       # Barrel export: LoginTest, AddUsersTest, CheckoutTest
        │   ├── login.test.js       # Login: page load, empty/missing/invalid/valid credentials
        │   ├── add.users.test.js   # Add User: empty/missing/invalid/boundary/age-zero/success/duplicate
        │   └── checkout.test.js    # Checkout: happy-flow cart → form → confirmation
        └── screenshots/
            ├── login/
            │   ├── login_page_success.png
            │   ├── login_form_empty.png
            │   ├── login_form_missing.png
            │   ├── login_form_invalid.png
            │   ├── login_form_valid.png
            │   └── bugs/            # login_page_error_*.png
            └── add_user/
                ├── add_user_empty_validation.png
                ├── add_user_missing_validation.png
                ├── add_user_invalid_validation.png
                └── bugs/            # add_user_invalid_age_validation.png, add_user_success_validation.png, add_user_existing_user_validation.png
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

Latest `test:belajar-bareng:report` run — **12 passing, 4 failing** out of 16 tests (~48s).

The 4 failures are **intentional**: each one first asserts against the *correct* expected behavior, and on failure re-asserts against the actual (buggy) output, screenshots it into a `bugs/` subfolder, then re-throws — so every confirmed bug is both documented and visible as a failure in the report (see [Known Bugs](#known-bugs-documented-in-tests) below).

| Suite | Passed | Failed |
|---|---|---|
| Login Page Functionality | 5 | 1 |
| Add Users Page Functionality | 6 | 3 |
| Checkout Page Functionality | 1 | 0 |
| **Total** | **12** | **4** |

Report artifacts:
- `mochawesome-report/mochawesome.json`
- `mochawesome-report/mochawesome.html`

## Test Coverage

1. **Login** (`login.test.js`)
   - Page load: opens `/login`, validates title, URL, and that the login form is visible (currently fails — see Known Bugs).
   - Empty credentials: submits with both fields blank, expects native "required" validation.
   - Missing credentials: username filled, password blank, expects the same validation on password.
   - Invalid credentials: wrong username/password, expects an `"Invalid username or password!"` toast.
   - Valid credentials: pulls username/password from the on-page hint button, logs in, and confirms redirect to `/users`.
   - Every outcome (pass or fail) is screenshotted.

2. **Add User** (`add.users.test.js`)
   - Empty form: submits with no input, expects `"Please fill out this field."` on username.
   - Missing age: username filled, age blank, expects the same validation on age.
   - Invalid input: non-string username / non-number age, plus a 10-character `maxlength` boundary check on the username field.
   - Age = 0: expects a "cannot be negative" validation message (fails — see Known Bugs).
   - Successful add: submits a valid user and checks the success toast.
   - Duplicate username: re-submits the same username, expects an "already exists" toast (fails — see Known Bugs).
   - Navigates to the Shop page to hand off to checkout.

3. **Checkout** (`checkout.test.js`)
   - Full happy-flow: adds two products to cart, validates each cart line item, fills the checkout form, solves the arithmetic captcha, opens and verifies the Terms & Conditions overlay, accepts it, submits, and validates the confirmation invoice (items + grand total) against the cart data collected earlier.

## Known Bugs Documented in Tests

| Location | Expected | Actual (asserted in test) |
|---|---|---|
| `src/modules/login.js` | Form title `"Sign In"` | Form title `"Sing in"` (typo) |
| `src/modules/login.js` (`/login` route) | Page title `"Login - User Management"` | Page title `"User Management"` (missing prefix) |
| `src/modules/add.users.js` (success toast) | Toast: `"User successfully added, Hi Quiz User!"` | Username spaces stripped: `"User successfully added, Hi QuizUser!"` |
| `src/modules/add.users.js` (age = 0) | Clear validation: `"Age cannot be negative."` | Garbled/interleaved text mixing the success and validation messages |
| `src/modules/add.users.js` (duplicate username) | Clear message: `"User with username Quiz User already exists."` | Garbled/interleaved text mixing the success and duplicate-user messages |
| `src/modules/checkout.js` | Cart route `/shop` (lowercase) | Route is capitalized: `/Shop` |

## Notes

- `BasePage.toastElement()` centralizes toast wait/visibility/text assertions with an optional screenshot callback, shared by `login.js` and `add.users.js`.
- `tests/belajar-bareng/modules/index.test.js` is a barrel that re-exports `LoginTest`, `AddUsersTest`, and `CheckoutTest` for `index.test.js`.
- Screenshots are written to `tests/<folderName>/screenshots/<subfolder>/<fileName>` via `BaseScreenshot`.