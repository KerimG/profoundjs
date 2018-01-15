
module.exports = {
  "port": 8080,
  "staticFilesDirectory": "htdocs",
  "pathlist": [
    "pjssamples"
  ],
  "initialModules": {
    "/hello": "pjssamples/hello",
    "/hello2": "pjssamples/hello2",
    "/connect4": "pjssamples/connect4"
  },
  "dbDriver": "IBMi",
  "timeout": 3600
}
