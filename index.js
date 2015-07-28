var dgram = require('dgram'),
    Lynx = require('lynx'),
    gauges = require('./lib/gauges'),
    middleware = require('./lib/middleware'),
    _ = require('lodash');
    onHeaders = require('on-headers');

module.exports.eventLoopGauge = function(metrics) {
  setInterval(function(metrics) {
    var timer = metrics.createTimer('event_loop_delay');
    setImmediate(timer.stop.bind(timer));
  }.bind(null, metrics), 10000);
};

module.exports.fileDescriptorGauge = function(metrics) {
  delay = delay ? delay : 30000;
  name = name ? name : 'file_descriptors';

  var recordConns = function(metrics) {
    exec('ls -q /proc/' + process.pid + '/fd | wc -l', function(err, data) {
      var count = Number(data);
      if (!err && count) {
        metrics.gauge('file_descriptors', 30000);
      }
      setTimeout(recordConns, 30000);
    });
  }.bind(null, metrics);

  setTimeout(recordConns, 30000);
};

module.exports.nodeMemoryGauge = function(metrics) {
  setInterval(function(metrics) {
    var memoryUsage = process.memoryUsage();
    metrics.gauge('memory.rss', memoryUsage.rss);
    metrics.gauge('memory.heapTotal', memoryUsage.heapTotal);
    metrics.gauge('memory.heapUsed', memoryUsage.heapUsed);
  }.bind(null, metrics), 10000);
};

module.exports.nodeConnectionsGauge = function(metrics, server) {

  var recordConns = function(metrics) {
    server.getConnections(function(err, count) {
      if (!err) {
        metrics.gauge('connections', count);
      }
      setTimeout(recordConns, 1000);
    });
  }.bind(null, metrics);

  setTimeout(recordConns, 1000);
};

module.exports.allGauges = function(metrics, server) {
  module.exports.eventLoopGauge(metrics);
  module.exports.fileDescriptorGauge(metrics);
  module.exports.nodeMemoryGauge(metrics);
  module.exports.nodeConnectionsGauge(metrics, server);
};

module.exports.requestStatsMiddleware = function(req, res, next) {
  var startTimeHr = process.hrtime();
  onHeaders(res, function() {
    var diff = process.hrtime(startTimeHr),
      time = diff[0] * 1000 + diff[1] * 1e-6;
    req.metrics.increment('res_status.' + res.statusCode);
    req.metrics.timing('res_time', time);
  });
  next();
};
