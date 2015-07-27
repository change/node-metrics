var onHeaders = require('on-headers'),
    hoursToMilliseconds = require('./lib/hoursToMilliseconds'),
    _ = require('lodash');

module.exports = function(lynxInst) {

  this.lynxInst = lynxInst;

  this.allMiddlewareOptions = ['requestStats'];

  this.requestStats = function() {
    return function(req, res, next) {
      var startTimeHr = process.hrtime();
      onHeaders(res, function() {
        var diff = process.hrtime(startTimeHr),
          time = hoursToMilliseconds(diff);
        req.metrics.increment('res_status.' + res.statusCode);
        req.metrics.timing('res_time', time);
      });
      next();
    };
  };

  this.appendMiddleWare = function(app, req, handlers) {
    if(!(app && req)) {
      throw new Error('Must provide ')
    }
    if(handlers && typeof(handlers) === Array) {
      if(_.intersection(handlers, this.allMiddlewareOptions).length !== handlers.length) {
        throw new Error('Invalid middleware option specified.');
      }
    } else {
      handlers = this.allMiddlewareOptions;
    }
    if(!_.has(req, 'metrics')) {
      req.metrics = this.lynxInst;
    }
    app.use(_.map(handlers, function(handlerName) {
      this[handlerName]();
    });
  };
};
