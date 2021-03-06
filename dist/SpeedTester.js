// Generated by CoffeeScript 1.9.3

/* SpeedTester 0.9.0 */

(function() {
  var defineSpeedTester,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (typeof console !== "undefined" && console !== null) {
    console.log('%cSpeedTester 0.9.0', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;');
  }

  defineSpeedTester = function(global) {
    var SpeedTester, second, Ø;
    Ø = Object.create && Object.create(null) || {};
    second = 1000;
    SpeedTester = (function() {
      function SpeedTester(times) {
        this._frame = bind(this._frame, this);
        this.frameCount = 0;
        this.times = times && Math.abs(Math.ceil(times)) || 1;
      }

      SpeedTester.prototype.run = function() {
        var requestAnimationFrame;
        requestAnimationFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame || global.webkitRequestAnimationFrame || global.oRequestAnimationFrame;
        this._testResults = {};
        this._complete = false;
        if (requestAnimationFrame) {
          requestAnimationFrame(this._frame);
        } else {
          if (typeof console !== "undefined" && console !== null) {
            console.warn("Your browser doesn't support \"requestAnimationFrame\"");
          }
          this._triggerComplete();
        }
        return this;
      };

      SpeedTester.prototype._triggerComplete = function() {
        this._testResults = {
          fps: this.frameCount / this.times
        };
        this._complete = true;
        return this._oncomplete && this._oncomplete.call(Ø, this._testResults);
      };

      SpeedTester.prototype._frame = function(tick) {
        this.frameCount++;
        if (!this.start) {
          this.start = tick;
        }
        if (tick - this.start < (second * this.times)) {
          return requestAnimationFrame(this._frame);
        } else {
          return this._triggerComplete();
        }
      };

      SpeedTester.prototype.oncomplete = function(_oncomplete) {
        this._oncomplete = _oncomplete;
        return this._complete && this._oncomplete.call(Ø, this._testResults);
      };

      return SpeedTester;

    })();
    return SpeedTester;
  };


  /* Export */

  if (typeof define === 'function' && define.amd) {
    define('SpeedTester', [], (function(_this) {
      return function() {
        return defineSpeedTester(_this);
      };
    })(this));
  } else {
    window.SpeedTester = defineSpeedTester(this);
  }

}).call(this);
