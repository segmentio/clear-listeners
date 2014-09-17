
/**
 * Module dependencies.
 */

var stub = require('./lib/stub');

/**
 * Stubbed objects.
 */

var stubs = [
  stub(window),
  stub(document)
];

/**
 * Clear event listeners.
 *
 * @api public
 */

exports = module.exports = function(){
  var i = stubs.length;
  while (i--) stubs[i].clear();
};

/**
 * Wrap window.addEventListener and window.removeEventListener
 * to be able to cleanup all event listeners for testing.
 *
 * @api public
 */

exports.bind = function(){
  var i = stubs.length;
  while (i--) stubs[i].bind();
};


/**
 * Reset window back to normal.
 *
 * @api public
 */

exports.unbind = function(){
  var i = stubs.length;
  while (i--) stubs[i].unbind();
};

/**
 * Automatically override.
 */

exports.bind();