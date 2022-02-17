'use strict';
require('dotenv').config();
const loggerConfig = require('./logger/config');
const HealthMiddleware = require('./middleware/health-check.middleware.js');

module.exports = {
  namespace: '',
  nodeID: process.env.HOSTNAME || null,

  logger: loggerConfig.local ? true : loggerConfig,
  logLevel: 'info',
  logFormatter: 'default',
  logObjectPrinter: null,
  transporter: {
    type: 'NATS',
    options: {
      url: process.env.NATS_HOST,
      user: process.env.NATS_USER,
      pass: process.env.NATS_PASS
    }
  },

  cacher: 'Memory',

  serializer: 'ProtoBuf',

  requestTimeout: 100 * 1000,
  retryPolicy: {
    enabled: false,
    retries: 5,
    delay: 100,
    maxDelay: 1000,
    factor: 2,
    check: (err) => err && !!err.retryable
  },

  maxCallLevel: 100,
  heartbeatInterval: 10,
  heartbeatTimeout: 30,

  tracking: {
    enabled: false,
    shutdownTimeout: 5000
  },

  disableBalancer: true, // false

  registry: {
    strategy: 'RoundRobin',
    preferLocal: true
  },

  circuitBreaker: {
    enabled: true,
    threshold: 0.5,
    windowTime: 60,
    minRequestCount: 20,
    halfOpenTime: 10 * 1000,
    check: (err) => err && err.code >= 500
  },

  bulkhead: {
    enabled: false,
    concurrency: 10,
    maxQueueSize: 100
  },

  validation: true,
  validator: null,

  metrics: {
    enabled: true,
    reporter: {
      type: 'Prometheus',
      options: {
        // HTTP port
        port: 3031,
        // HTTP URL path
        path: '/metrics',
        defaultLabels: (registry) => ({
          namespace: registry.broker.namespace,
          nodeID: registry.broker.nodeID
        })
      }
    }
  },

  tracing: {
    enabled: true,
    exporter: {
      type: 'Console',
      options: {
        // Custom logger
        logger: null,
        // Using colors
        colors: true,
        // Width of row
        width: 100,
        // Gauge width in the row
        gaugeWidth: 40
      }
    }
  },

  metricsRate: 1,

  internalServices: true,
  internalMiddlewares: true,

  hotReload: false,

  // Register custom middlewares
  middlewares: [HealthMiddleware()],

  // Called after broker created.
  created(broker) {

  },

  // Called after broker starte.
  started(broker) {

  },

  // Called after broker stopped.
  stopped(broker) {

  },

  replCommands: null
};
