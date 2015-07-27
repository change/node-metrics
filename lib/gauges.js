var exec = require('child_process').exec;

module.exports = function  (lynxInst) {

  this.lynxInst = lynxInst;

  this.eventLoop = function(name, delay) {
    name = name ? name : 'event_loop_delay';
    delay = delay ? delay : 10000
    setInterval(function(metrics) {
      var timer = metrics.createTimer(name);
      setImmediate(timer.stop.bind(timer));
    }.bind(null, this.lynxInst), delay);
  };

  this.fileDescriptor = function(name, delay) {
    delay = delay ? delay : 30000;
    name = name ? name || 'file_descriptors';

    function recordConns() {
      exec('ls -q /proc/' + process.pid + '/fd | wc -l', function(err, data) {
        var count = Number(data);
        if (!err && count) {
          this.lynxInst.gauge(name, count);
        }
        setTimeout(recordConns, delay);
      }.bind(this));
    }

    setTimeout(recordConns, delay);
  };

  this.nodeMemory = function(name, delay) {
    name = name ? name : 'memory';
    delay = delay ? delay : 10000
    setInterval(function() {
      var memoryUsage = process.memoryUsage();
      this.lynxInst.gauge(name + '.rss', memoryUsage.rss);
      this.lynxInst.gauge(name + '.heapTotal', memoryUsage.heapTotal);
      this.lynxInst.gauge(name + '.heapUsed', memoryUsage.heapUsed);
    }.bind(this), delay);
  };

  this.nodeConnections = function(server, name, delay) {
    name = name ? name : 'connections';
    delay = delay ? delay : 1000
    function recordConns() {
      server.getConnections(function(err, count) {
        if (!err) {
          this.lynxInst.gauge(name, count);
        }
        setTimeout(recordConns.bind(this), delay);
      }.bind(this));
    };

    setTimeout(recordConns.bind(this), delay);
  };

  this.gaugeAll = function(server) {
    this.eventLoop();
    this.file_descriptors();
    this.nodeMemory();
    this.nodeConnections(server);
  };
};
