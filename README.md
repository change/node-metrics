# node_metrics
Easily forward a node app's basic health metrics to a local statsd instance.

## Getting Set Up
1. Install

  ```
  npm install node-metrics
  ```
2. Configure
  Supply a [Lynx](https://github.com/dscape/lynx) instance:

  ```js
  var nodeMetrics = require('node-metrics')({ metrics: <your_lync_inst> });
  ```
  Or provide a port and namespace, and let us do the setup:

  ```js
  var nodeMetrics = require('node-metrics')({
    port: 8125, //port that your statsd instance lives on
    namespace: 'my_app' //namespace of your choosing
  });
  ```
  
## Collecting data!
  node-metrics provides middleware and library functions for collecting basic health metrics. Library functions are available as:
  ```
  nodeMetrics.gauges.<gauge_name>(name, delay)
  ```

  The name param allows you to change the datapoint name that is sent to statsd, and the delay param allows you to change how frequently the metric is gauged (in milliseconds). Note that the nodeConnections gauge requires its third and final argument to be an instance of an http server (as returned by app.listen() ).
  Additionally, you can use:
  ```
  nodeMetrics.gaugeAll(server)
  ```
  This will track metrics for everything with default names. You can modify names and delay times by passes an object:
  ```
  nodeMetrics.gaugeAll(server, {
    nodeConnections: { name: 'custom_node_connection_name', delay: 40000 }
  });
  ```
  
  An easy way to integrate this into your node app is to:
  ```
  var server = app.listen(app.get('port'), function () {
    nodeMetrics.gaugeAll(server);
  });
  ```
  
  Middleware is available as:
  ```
  app.use(nodeMetrics.selectMiddleware(['middleware1', middleware2']));
  ```
  Note that providing no argument to selectMiddleware will select all middleware. Also note that adding any middleware will append a 'metrics' object to your req.
  
