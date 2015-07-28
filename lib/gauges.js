var exec = require('child_process').exec;

module.exports = function(lynxInst) {
  return {

    eventLoop: function(name, delay) {
      name = name ? name : 'event_loop_delay';
      delay = delay ? delay : 10000;
      setInterval(function(metrics) {
        var timer = metrics.createTimer(name);
        setImmediate(timer.stop.bind(timer));
      }.bind(null, lynxInst), delay);
    },

    fileDescriptor: function(name, delay) {
      delay = delay ? delay : 30000;
      name = name ? name : 'file_descriptors';

      var recordConns = function(metrics) {
        exec('ls -q /proc/' + process.pid + '/fd | wc -l', function(err, data) {
          var count = Number(data);
          if (!err && count) {
            metrics.gauge(name, count);
          }
          setTimeout(recordConns, delay);
        });
      }.bind(null, lynxInst);

      setTimeout(recordConns, delay);
    },

    nodeMemory: function(name, delay) {
      name = name ? name : 'memory';
      delay = delay ? delay : 10000;
      setInterval(function(metrics) {
        var memoryUsage = process.memoryUsage();
        metrics.gauge(name + '.rss', memoryUsage.rss);
        metrics.gauge(name + '.heapTotal', memoryUsage.heapTotal);
        metrics.gauge(name + '.heapUsed', memoryUsage.heapUsed);
      }.bind(null, lynxInst), delay);
    },

    nodeConnections: function(name, delay, server) {
      name = name ? name : 'connections';
      delay = delay ? delay : 1000
      var recordConns = function(metrics) {
        server.getConnections(function(err, count) {
          if (!err) {
            metrics.gauge(name, count);
          }
          setTimeout(recordConns, delay);
        });
      }.bind(null, lynxInst);

      setTimeout(recordConns, delay);
    }

  };
};
