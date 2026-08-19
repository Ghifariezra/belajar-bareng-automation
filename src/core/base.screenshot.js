import fs from "fs";
import path from "path";

export class BaseScreenshot {
    #BASE_PATH = "tests";

    constructor(folderName) {
        this.folderName = `${this.#BASE_PATH}/${folderName}/screenshots`;
    }

    async takeScreenshot(buffer, folderName, fileName) {
        try {
            const dirPath = path.join(this.folderName, folderName);

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            const filePath = path.join(dirPath, fileName);
            fs.writeFileSync(
                filePath,
                buffer,
                "base64"
            );
        } catch (error) {
            console.error("Error taking screenshot:", error);
        }
    }
}