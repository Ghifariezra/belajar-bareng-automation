import { By } from "selenium-webdriver";

export const LoginLocators = Object.freeze({
    formOverlay: By.id("loginOverlay"),
    formBox: By.css("#loginOverlay .loginBox"),
    formTitle: By.css("#loginOverlay .loginBox h3"),

    hintButton: By.css("button[data-testid='hint-button']"),
    hintUsername: By.id("hintUser"),
    hintPassword: By.id("hintPass"),

    usernameInput: By.css("input[data-testid='username-input']"),
    passwordInput: By.css("input[data-testid='password-input']"),
    loginButton: By.css("button[data-testid='login-button']"),
});