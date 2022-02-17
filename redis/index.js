const redis = require('redis');
const {REDIS_HOST, REDIS_PORT, REDIS_PASS} = process.env;

const pub = redis.createClient(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASS });
const sub = redis.createClient(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASS });

pub.on('error', function (error) {
  // eslint-disable-next-line no-console
  console.error('Redis pub error:', error);
});

sub.on('error', function (error) {
  // eslint-disable-next-line no-console
  console.error('Redis sub error:', error);
});

pub.on('ready', function () {
  // eslint-disable-next-line no-console
  console.error('Redis pub ready');
});

sub.on('ready', function () {
  // eslint-disable-next-line no-console
  console.error('Redis sub ready');
});

module.exports = {
  redisPub: pub,
  redisSub: sub
};
