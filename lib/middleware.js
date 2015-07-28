var onHeaders = require('on-headers'),
    hoursToMilliseconds = require('./hoursToMilliseconds'),
    _ = require('lodash');

module.exports = {
  requestStats: function(req, res, next) {
    var startTimeHr = process.hrtime();
    onHeaders(res, function() {
      var diff = process.hrtime(startTimeHr),
        time = hoursToMilliseconds(diff);
      req.metrics.increment('res_status.' + res.statusCode);
      req.metrics.timing('res_time', time);
    });
    next();
  }
};
