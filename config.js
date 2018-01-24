
module.exports = {
  "port": 8080,
  "staticFilesDirectory": "htdocs",
  "pathlist": [
    "pjssamples",
    "ocr",
    "kerim",
    "test_vog"
  ],
  "initialModules": {
    "/hello": "pjssamples/hello",
    "/hello2": "pjssamples/hello2",
    "/connect4": "pjssamples/connect4",
    "/ocr": "ocr/ocr",
    "/test_connection": "kerim/test_connection",
    "/vog" : "test_vog/vog"
  },
  "dbDriver": "IBMi",
  "timeout": 3600
}
