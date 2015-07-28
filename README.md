# node_metrics
Easily forward a node app's basic health metrics to a local statsd instance.

## Getting Set Up
1. Install

  ```js
  npm install node-metrics
  ```
2. Configure
  Supply a [Lynx](https://github.com/dscape/lynx) instance:

  ```js
  var nodeMetrics = require('node-metrics')({ metrics: <your_lync_inst> });
  ```
  
## Collecting data!
  node-metrics provides middleware and library functions for collecting basic health metrics. Library functions are available as:
