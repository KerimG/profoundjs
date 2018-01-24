const path = require('path');

function file_upload_vog() {
    pjs.defineDisplay("display", "vog.json");
    targetdir = __dirname;

    while (true) {
        display.screen.execute();
    }
}


exports.run = file_upload_vog;