# node_metrics
Easily forward a node app's basic health metrics to a local statsd instance.

## Getting set up
1. Install

  ```js
  npm install node-metrics
  ```
2. Configure

  Create a [Lynx](https://github.com/dscape/lynx) instance:

  ```js
  var Lynx = require('lynx'),
      dgram = require('dgram');

  var metrics = new Lynx('localhost', 8125, {
    socket: dgram.createSocket('udp4'),
    scope: 'YOUR_NAMESPACE'
  });
  ```
  
## Collecting data!
  node-metrics provides middleware and library functions for collecting basic health metrics.

  ### Use an individual gauge

  ```js
  require('node-metrics').nodeMemoryGauge(metrics);
  ```

  Or for node connections:

  ```js
  require('node-metrics').nodeConnectsGauge(metrics, server);
  ```

  Where server is an http server instance (as supplied by app.listen() ).

  ### Use all gauges
  To configure all gauges at once, do:

  ```js
  require('node-metrics').allGuages(metrics, server);
  ```

  ### Use middleware 
  Ensure you append your Lynx instance to the req object as req.metrics. Then append middleware like:

  ```js
  app.use(require('node-metrics').requestStatsMiddleware);
  ```

