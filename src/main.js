var config = require("./config.js");
var bosunalert = require("./bosunalert.js");
var fs = require('fs');
console.log("Generating rules...");
var alertsString = "";
for (var i = 0; i < config.alerts.length; i++) {
  alertsString += alertsToString(bosunalert(config.alerts[i]));
}
getTemplate(function(template) {
  var newConf = template.replace("${{ALERTS}}$", alertsString);
  writeToFile("newrules.conf", newConf);
});


function alertsToString(alertObjects) {
  var alertsString = "";
  for (var i = 0; i < alertObjects.length; i++) {
    alertsString += alertObjects[i].toString() + "\r\r";
  }
  return alertsString;
}
function getTemplate(fn) {
  fs.readFile('rulestemplate.conf', 'utf8', function (err,data) {
    if (err) return console.log(err);
    fn(data);
  });
}
function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, function(err) {
    if(err) return console.error(err);
    console.log("The file was saved!");
  });
}
