var config = require("./config");
module.exports = function alert(alertConfig) {
  if (alertConfig.type == "averageAnomalyOnIncrease") return [averageAnomalyOnIncreaseAlert(alertConfig)];
  if (alertConfig.type == "averageAnomalyOnDecrease") return [averageAnomalyOnDecreaseAlert(alertConfig)];
  if (alertConfig.type == "topBoxes") {
    var alerts = [];
    var metric = alertConfig.metric
    for (var i = 0; i < config.top; i++) {
      alertConfig.metric = metric + "." + i + ".count";
      alerts.push(averageAnomalyOnIncreaseAlert(alertConfig, alertConfig.name + "." + i));
    }
    alertConfig.metric = metric;
    return alerts;
  }
}
function averageAnomalyOnIncreaseAlert(alertConfig, customName) {
  return averageAnomalyAlert(alertConfig, "$sample2result > $warnthreshold", "$sample2result > $critthreshold", customName);
}
function averageAnomalyOnDecreaseAlert(alertConfig, customName) {
  return averageAnomalyAlert(alertConfig, "$sample2result < 0 - $warnthreshold", "$sample2result < 0 - $critthreshold", customName);
}
function averageAnomalyAlert(alertConfig, warn, crit, customName) {
  return {
    name: customName? customName: alertConfig.name,
    template: "averageanomaly",
    critNotification: "email",
    sample1result: "avg(influx(\"" + config.db + "\", '''SELECT mean(\"" + alertConfig.metric + "\") FROM \"" + config.measurement + "\"''', \"" + alertConfig.startSample1 + "\", \"" + alertConfig.stopSample1 + "\", \"" + alertConfig.groupSample1 + "\"))",
    sample2result: "last(influx(\"" + config.db + "\", '''SELECT DERIVATIVE(mean(\"" + alertConfig.metric + "\")) FROM \"" + config.measurement + "\" where time < now() GROUP BY time(" + alertConfig.groupSample2 + ")''', \"" + alertConfig.startSample2 + "\", \""+ alertConfig.stopSample2 + "\", \"" + alertConfig.groupSample2 + "\"))",
    warnthreshold: "$sample1result * " + alertConfig.warnThresholdMultiplicator,
    critthreshold: "$sample1result * " + alertConfig.critThresholdMultiplicator,
    warn: warn,
    crit: crit,
    toString: function () {
      return "alert " + dotNotatedAlertName(this.name) + " {" + "\r" +
                                              "\t" + "$name = '" + this.name + "'" + "\r" +
                                              "\t" + "template = " + this.template + "\r" +
                                              "\t" + "critNotification = " + this.critNotification + "\r" +
                                              "\t" + "$sample1result = " + this.sample1result + "\r" +
                                              "\t" + "$sample2result = " + this.sample2result + "\r" +
                                              "\t" + "$warnthreshold = " + this.warnthreshold + "\r" +
                                              "\t" + "warn = " + this.warn + "\r" +
                                              "\t" + "$critthreshold = " + this.critthreshold + "\r" +
                                              "\t" + "crit = " + this.crit + "\r" +
                                              "}";
    }
  }
}
function dotNotatedAlertName(name) {
  return name.replace(new RegExp(" ", "g"), ".");
}
