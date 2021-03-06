const _ = require('lodash');
const http = require('http');
const port = process.env.HEALTH_CHECK_PORT || Math.floor(Math.random() * 50000) + 10000;

module.exports = function (opts) {
  opts = _.defaultsDeep(opts, {
    port,
    readiness: {
      path: '/ready'
    },
    liveness: {
      path: '/live'
    }
  });

  let state = 'down';
  let server;

  function handler (req, res) {
    if (req.url === opts.readiness.path || req.url === opts.liveness.path) {
      const resHeader = { 'Content-Type': 'text/plain' };

      const content = {
        state,
        uptime: process.uptime(),
        timestamp: Date.now()
      };

      if (req.url === opts.readiness.path) {
        // Readiness if the broker started successfully.
        // https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes
        res.writeHead(state === 'up' ? 200 : 503, resHeader);
      } else {
        // Liveness if the broker is not stopped.
        // https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-liveness-command
        res.writeHead(state !== 'down' ? 200 : 503, resHeader);
      }

      const response = `state: ${state}, uptime: ${content.uptime}, timestamp: ${content.timestamp}`
      res.end(response);
    } else {
      res.writeHead(404, http.STATUS_CODES[404], {});
      res.end();
    }
  }

  return {
    created (broker) {
      state = 'starting';

      server = http.createServer(handler);
      server.listen(opts.port, (err) => {
        if (err) {
          return broker.logger.error('Unable to start health-check server', err);
        }

        broker.logger.info('');
        broker.logger.info('K8s health-check server listening on');
        broker.logger.info(`    http://localhost:${opts.port}${opts.readiness.path}`);
        broker.logger.info(`    http://localhost:${opts.port}${opts.liveness.path}`);
        broker.logger.info('');
      });
    },

    // After broker started
    started (broker) {
      state = 'up';
    },

    // Before broker stopping
    stopping (broker) {
      state = 'stopping';
    },

    // After broker stopped
    stopped (broker) {
      state = 'down';
      server.close();
    }
  };
};
