'use strict';

module.exports = {
  type: 'Console',
  local: true,
  options: {
  // Logging level
    level: 'info',
    // Using colors on the output
    colors: true,
    // Print module names with different colors (like docker-compose for containers)
    moduleColors: false,
    // Line formatter. It can be "json", "short", "simple", "full", a `Function` or a template string like "{timestamp} {level} {nodeID}/{mod}: {msg}"
    formatter: 'full',
    // Custom object printer. If not defined, it uses the `util.inspect` method.
    objectPrinter: null,
    // Auto-padding the module name in order to messages begin at the same column.
    autoPadding: false
  }
};

