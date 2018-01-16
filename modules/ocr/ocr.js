const tesseract = require('tesseract.js');
const path = require('path');

function ocr() {
    pjs.defineDisplay("display", "ocr.json");
    targetdir = __dirname;

    while(true) {
        uploaded = "";
        display.screen1.execute();
        var resultHtml = '';
        if(uploaded === "001") {
            var imagePath = path.join(targetdir.trim(), "ocr.jpg");
            var tesseractPromise = tesseract.create(
                {
                    // workerPath: "C:\\Users\\Kerim\\code\\pjs\\node_modules\\tesseract.js\\src\\node\\worker.js",
                    langPath: "eng.traineddata",
                    // corePath: "C:\\Users\\Kerim\\code\\pjs\\node_modules\\tesseract.js\\src\\node\\index.js"
                }
            ).recognize(imagePath, {lang: 'eng'});
            var result = pjs.fiber.runPromise(tesseractPromise);
            resultHtml = result.html;        
        }
        html += resultHtml;
        console.log('Result: ', resultHtml);
    }
}


exports.run = ocr;