var dgram = require('dgram'),
    Lynx = require('lynx'),
    gauges = require('./lib/gauges'),
    middleware = require('./lib/middleware'),
    _ = require('lodash');

function NodeMetrics(options) {
  var nodeMetrics = {};

  if(options.metrics) { 
    nodeMetrics.lynxInst = metrics;
  }
  else if(options.port) {
    var lynxConfig = {
      socket: dgram.createSocket('udp4')
    };
    if(options.namespace) {
      lynxConfig.namespace = options.namespace;
    }
    nodeMetrics.lynxInst = new Lynx('localhost', options.port, lynxConfig); 
  }

  nodeMetrics = _.extend(nodeMetrics, {
    gauges: gauges(nodeMetrics.lynxInst),
    middleware: middleware,

    validateHandlers: function(handlers) {
      if(!handlers) return _.keys(this.middleware);
      if(typeof(handlers) !== Array) throw new Error('Handlers must be an array of strings.');
      if(_.intersection(handlers, _.keys(this.middleware)).length !== handlers.length) {
        throw new Error('Invalid middleware option.');
      }
      return handlers;
    },

    selectMiddleware: function(handlers) {
      handlers = this.validateHandlers(handlers);
      var middlewareHandlers = _.map(handlers, function(handlerName) {
        return this.middleware[handlerName];
      }.bind(this));
      middlewareHandlers.unshift(function(req, res, next) {
        if(!req.metrics) req.metrics = this.lynxInst;
        next();
      }.bind(this));
      return middlewareHandlers;
    },

    gaugeAll: function(server, specifications) {
      _.forEach(_.keys(this.gauges), function(name) {
        var argsForFunc = ['name', 'delay'];
        _.map(argsForFunc, function(argName) {
          var specsForFunc = specifications[name];
          if(!specsForFunc) return null;
          if(specsForFunc[argName]) return specsForFunc[argName];
          else return null;
        });
        var guageFunc = this.gauges[name];
        if(gaugeFunc.length === 3) {
          argsForFunc.push(server);
        }
        gaugeFunc.apply(this.gauges, argsForFunc);
      }.bind(this));
    }

  });

  return nodeMetrics;
};

module.exports = NodeMetrics;
