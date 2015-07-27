var dgram = require('dgram'),
    Lynx = require('lynx'),
    Gauges = require('./lib/gauges'),
    Middleware = require('./lib.middleware');

function NodeMetrics(options) {
  if(options.metrics) { 
    this.lynxInst = metrics;
  }
  else if(options.port) {
    var lynxConfig = {
      socket: dgram.createSocket('udp4')
    };
    if(options.namespace) {
      lynxConfig.namespace = options.namespace;
    }
    this.lynxInst = new Lynx('localhost', options.port, lynxConfig); 
  }

  this.gauge =  new Gauges(this.lynxInst);
  this.middleware = new Middleware(this.lynxInst);
};


module.exports = NodeMetrics;
