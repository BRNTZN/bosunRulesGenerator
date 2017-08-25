var chai = require('chai');
var expect = chai.expect;
var bosunalert = require('../src/bosunalert');
var config = require('../src/config');
describe("Bosun alert suite", function() {
  it("1. is defined", function() {
    expect(bosunalert).to.not.be.undefined;
  });
  it("2. averageAnomalyOnIncrease alertObject", function() {
    config.db = "aaafdqsf";
    config.measurement = "fqsdfqsdf";
    var alertConfig = {
      type: "averageAnomalyOnIncrease",
      name: "zearazer",
      metric: "sdqfqsdf",
      startSample1: "3h",
      stopSample1: "1h",
      groupSample1: "1d",
      startSample2: "1h",
      stopSample2: "30m",
      groupSample2: "5m",
      warnThresholdMultiplicator: "0.55",
      critThresholdMultiplicator: "0.99"
    };
    var alertObjects = bosunalert(alertConfig);
    expectAlertObjects(alertObjects);
    expect(alertObjects.length).to.equal(1);
    var alertObject = alertObjects[0];
    expect(alertObject.name).to.equal(alertConfig.name);
    expectAlertObject(alertObject, alertConfig);
    expect(alertObject.sample1result).to.equal("avg(influx(\"" + config.db + "\", '''SELECT mean(\"" + alertConfig.metric + "\") FROM \"" + config.measurement + "\"''', \"" + alertConfig.startSample1 + "\", \"" + alertConfig.stopSample1 + "\", \"" + alertConfig.groupSample1 + "\"))");
    expect(alertObject.sample2result).to.equal("last(influx(\"" + config.db + "\", '''SELECT DERIVATIVE(mean(\"" + alertConfig.metric + "\")) FROM \"" + config.measurement + "\" where time < now() GROUP BY time(" + alertConfig.groupSample2 + ")''', \"" + alertConfig.startSample2 + "\", \"" + alertConfig.stopSample2 + "\", \"" + alertConfig.groupSample2 + "\"))");
    expect(alertObject.warnthreshold).to.equal("$sample1result * " + alertConfig.warnThresholdMultiplicator);
    expect(alertObject.warn).to.equal("$sample2result > $warnthreshold");
    expect(alertObject.critthreshold).to.equal("$sample1result * " + alertConfig.critThresholdMultiplicator);
    expect(alertObject.crit).to.equal("$sample2result > $critthreshold");
    expectToString(alertObject);
  });
  it("3. averageAnomalyOnDecrease alertObject", function() {
    config.db = "aaafdqsf";
    config.measurement = "fqsdfqsdf";
    var alertConfig = {
      type: "averageAnomalyOnDecrease",
      name: "xcvwvcxwv",
      metric: "xcwvwxcvwxcv",
      startSample1: "1h",
      stopSample1: "4h",
      groupSample1: "3d",
      startSample2: "1h",
      stopSample2: "2h",
      groupSample2: "3h",
      warnThresholdMultiplicator: "0.44",
      critThresholdMultiplicator: "0.12"
    };
    var alertObjects = bosunalert(alertConfig);
    expectAlertObjects(alertObjects);
    expect(alertObjects.length).to.equal(1);
    var alertObject = alertObjects[0];
    expect(alertObject.name).to.equal(alertConfig.name);
    expectAlertObject(alertObject, alertConfig);
    expect(alertObject.sample1result).to.equal("avg(influx(\"" + config.db + "\", '''SELECT mean(\"" + alertConfig.metric + "\") FROM \"" + config.measurement + "\"''', \"" + alertConfig.startSample1 + "\", \"" + alertConfig.stopSample1 + "\", \"" + alertConfig.groupSample1 + "\"))");
    expect(alertObject.sample2result).to.equal("last(influx(\"" + config.db + "\", '''SELECT DERIVATIVE(mean(\"" + alertConfig.metric + "\")) FROM \"" + config.measurement + "\" where time < now() GROUP BY time(" + alertConfig.groupSample2 + ")''', \"" + alertConfig.startSample2 + "\", \"" + alertConfig.stopSample2 + "\", \"" + alertConfig.groupSample2 + "\"))");
    expect(alertObject.warnthreshold).to.equal("$sample1result * " + alertConfig.warnThresholdMultiplicator);
    expect(alertObject.warn).to.equal("$sample2result < 0 - $warnthreshold");
    expect(alertObject.critthreshold).to.equal("$sample1result * " + alertConfig.critThresholdMultiplicator);
    expect(alertObject.crit).to.equal("$sample2result < 0 - $critthreshold");
    expectToString(alertObject);
  });
  it("4. averageAnomalyOnIncreaseByBox alertObject", function() {
    config.db = "zerze";
    config.measurement = "fsdfq";
    var alertConfig = {
      type: "topBoxes",
      name: "zearrr",
      metric: "sqdfqsdf",
      startSample1: "2h",
      stopSample1: "2h",
      groupSample1: "2h",
      startSample2: "2h",
      stopSample2: "2h",
      groupSample2: "2h",
      warnThresholdMultiplicator: "0.44",
      critThresholdMultiplicator: "0.55"
    };
    var alertObjects = bosunalert(alertConfig);
    expectAlertObjects(alertObjects);
    expect(alertObjects.length).to.equal(10);
    var alertObject0 = alertObjects[0];
    expect(alertObject0.name).to.equal(alertConfig.name + "." + 0);
    expectAlertObject(alertObject0, alertConfig);
    expect(alertObject0.sample1result).to.equal("avg(influx(\"" + config.db + "\", '''SELECT mean(\"" + alertConfig.metric + ".0.count\") FROM \"" + config.measurement + "\"''', \"" + alertConfig.startSample1 + "\", \"" + alertConfig.stopSample1 + "\", \"" + alertConfig.groupSample1 + "\"))");
    expect(alertObject0.sample2result).to.equal("last(influx(\"" + config.db + "\", '''SELECT DERIVATIVE(mean(\"" + alertConfig.metric + ".0.count\")) FROM \"" + config.measurement + "\" where time < now() GROUP BY time(" + alertConfig.groupSample2 + ")''', \"" + alertConfig.startSample2 + "\", \"" + alertConfig.stopSample2 + "\", \"" + alertConfig.groupSample2 + "\"))");
    expect(alertObject0.warnthreshold).to.equal("$sample1result * " + alertConfig.warnThresholdMultiplicator);
    expect(alertObject0.warn).to.equal("$sample2result > $warnthreshold");
    expect(alertObject0.critthreshold).to.equal("$sample1result * " + alertConfig.critThresholdMultiplicator);
    expect(alertObject0.crit).to.equal("$sample2result > $critthreshold");
    expectToString(alertObject0);
  });
  function expectAlertObjects(alertObjects) {
    expect(alertObjects).to.not.be.undefined;
    expect(alertObjects.length).to.not.be.undefined;
  }
  function expectAlertObject(alertObject, alertConfig) {
    expect(alertObject).to.not.be.undefined;
    expect(alertObject.template).to.equal("averageanomaly");
    expect(alertObject.critNotification).to.equal("email");
  }
  function expectToString(alertObject) {
    expect(alertObject.toString()).to.equal(
      "alert " + alertObject.name + " {" + "\r" +
                                              "\t" + "$name = '" + alertObject.name + "'" + "\r" +
                                              "\t" + "template = " + alertObject.template + "\r" +
                                              "\t" + "critNotification = " + alertObject.critNotification + "\r" +
                                              "\t" + "$sample1result = " + alertObject.sample1result + "\r" +
                                              "\t" + "$sample2result = " + alertObject.sample2result + "\r" +
                                              "\t" + "$warnthreshold = " + alertObject.warnthreshold + "\r" +
                                              "\t" + "warn = " + alertObject.warn + "\r" +
                                              "\t" + "$critthreshold = " + alertObject.critthreshold + "\r" +
                                              "\t" + "crit = " + alertObject.crit + "\r" +
                                              "}"
    );
  }
});
