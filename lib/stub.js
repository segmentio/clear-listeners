
/**
 * Expose `StubListeners`.
 */

module.exports = StubListeners;

/**
 * Stub the `addEventListener` and `removeEventListener` on
 * objects like the window, document, and perhaps other things.
 *
 * @param {Object} source The event target, like `window` or `document`.
 * @api public
 */

function StubListeners(source){
  if (!(this instanceof StubListeners)) return new StubListeners(source);
  this.source = source;
  this.listeners = [];
  this.onName = source.addEventListener ? 'addEventListener' : 'attachEvent';
  this.offName = source.removeEventListener ? 'removeEventListener' : 'detachEvent';
  this.onFn = source[this.onName];
  this.offFn = source[this.offName];
};

/**
 * Wrap window.addEventListener and window.removeEventListener
 * to be able to cleanup all event listeners for testing.
 *
 * @api public
 */

StubListeners.prototype.bind = function(){
  var listeners = this.listeners;
  var source = this.source;
  var on = this.onName;
  var off = this.offName;
  var onFn = this.onFn;
  var offFn = this.offFn;

  source[on] = function(){
    listeners.push(arguments);
    return onFn.apply
      ? onFn.apply(source, arguments)
      : onFn(arguments[0], arguments[1]); // IE
  };

  source[off] = function(name, listener, useCapture){
    for (var i = 0, n = listeners.length; i < n; i++) {
      if (name !== listeners[i][0]) continue;
      if (listener !== listeners[i][1]) continue;
      if (arguments.length > 2 && useCapture !== listeners[i][2]) continue;
      listeners.splice(i, 1);
      break;
    }
    return offFn.apply
      ? offFn.apply(source, arguments)
      : offFn(arguments[0], arguments[1]); // IE
  };
};

/**
 * Reset window back to normal.
 *
 * @api public
 */

StubListeners.prototype.unbind = function(){
  this.listeners.length = 0;
  this.source[this.onName] = this.onFn;
  this.source[this.onName] = this.offFn;
};

/**
 * Clear event listeners.
 *
 * @api public
 */

StubListeners.prototype.clear = function(){
  var listeners = this.listeners;
  var source = this.source;
  var i = listeners.length;
  var on = this.onName;
  while (i--) {
    source[on].apply
      ? source[on].apply(source, listeners[i])
      : source[on](listeners[i][0], listeners[i][1]); // IE
  }
  listeners.length = 0;
};