const authDirective = require('./auth-directives');
const rateLimiterDirective = require('./rate-limit');

module.exports = {
  auth: authDirective,
  rateLimit: rateLimiterDirective
};