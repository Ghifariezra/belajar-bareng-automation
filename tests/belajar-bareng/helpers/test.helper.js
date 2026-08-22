import assert from "assert";

export async function handleAfterEach(mochaTest, pageObject, testContext, config) {
    if (!mochaTest) return;

    const { state, err, title } = mochaTest;
    const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const { folderPath, screenshotType, expectedToastMessage } = config;

    if (state === "failed" && err) {
        if (err instanceof assert.AssertionError) {
            const cleanExpected = String(err.expected ?? "empty").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
            const cleanActual = String(err.actual ?? "empty").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

            await pageObject.takeScreenshotOfFormBox(
                `${folderPath}/bugs/${cleanExpected}_vs_${cleanActual}`,
                `${cleanTitle}.png`
            );
        } else {
            await pageObject.takeScreenshotOfFormBox(
                `${folderPath}/errors/other`,
                `${cleanTitle}.png`
            );
        }
    } else if (state === "passed") {
        if (screenshotType === "form") {
            await pageObject.takeScreenshotOfFormBox(
                `${folderPath}/success`,
                `${cleanTitle}.png`
            );
        } else if (screenshotType === "toast") {
            await pageObject.getToastMessage(
                expectedToastMessage,
                `success/${cleanTitle}.png`
            );
        } else if (screenshotType === "full") {
            await pageObject.takeScreenshot(
                await testContext.driver.takeScreenshot(),
                `${folderPath}/success`,
                `${cleanTitle}.png`
            );
        }
    }
}