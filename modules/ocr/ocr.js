const tesseract = require("tesseract.js");
const path = require("path");
const { promisify } = require("util");
const LanguageTranslatorV2 = require("watson-developer-cloud/language-translator/v2");

var translator = new LanguageTranslatorV2({
  username: "2f2c754a-543a-45e4-8982-76ce4b49e8f6",
  password: "nUCvVjw0WVTe",
  version: "v2"
});

function ocr() {
  pjs.defineDisplay("display", "ocr.json");
  targetdir = __dirname;

  let result;
  let imagePath;
  let tesseractPromise;
  let translation;

  let translationParameters = {
    text: "",
    model_id: "en-de"
  };

  let translatePromise = promisify(translator.translate).bind(translator);

  while (true) {
    uploaded = "";

    display.screen1.execute();
    if (uploaded === "001") {
      imagePath = path.join(targetdir.trim(), "ocr.jpg");
      tesseractPromise = tesseract
        .create({
          workerPath:
            "C:\\Users\\Kerim\\code\\pjs\\node_modules\\tesseract.js\\src\\node\\worker.js",
          langPath: "en.traineddata",
          corePath:
            "C:\\Users\\Kerim\\code\\pjs\\node_modules\\tesseractjs-core\\index.js"
        })
        .recognize(imagePath, { lang: "eng" });
      result = pjs.fiber.runPromise(tesseractPromise);
      html = result.html;
    }
    if (translate) {
      translationParameters.text = result.text;

      result = pjs.fiber.runPromise(translatePromise(translationParameters));

      translated = result.translations[0].translation;
    }
  }
}

exports.run = ocr;
