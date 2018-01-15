const tesseract = require('tesseract.js');
const path = require('path');

function ocr() {
    pjs.defineDisplay("display", "ocr.json");
    targetdir = __dirname;

    while(!exit) {
        uploaded = "";
        display.screen1.execute();

        if(uploaded === "001") {
            var imagePath = path.join(targetdir.trim(), "ocr.jpg");
            var tesseractPromise = tesseract.recognize(imagePath, "eng");
            var results = pjs.fiber.runPromise(tesseractPromise);
            html = results.html;
        }
    }
}


exports.run = ocr;