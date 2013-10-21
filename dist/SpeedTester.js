(function() {
  window.SpeedTester = (function() {
    function SpeedTester(benchmarkUrl) {
      this.benchmarkUrl = benchmarkUrl;
      if (!this.benchmarkUrl) {
        throw new Error('You must specify the benchmark url');
      }
    }

    SpeedTester.prototype.run = function() {
      var _this = this;
      if (typeof Worker !== "undefined" && Worker !== null) {
        window.addEventListener('unload', function() {
          var _ref;
          return (_ref = _this.worker) != null ? _ref.terminate() : void 0;
        });
        this.worker = new Worker(this.benchmarkUrl);
        this.worker.onmessage = function(event) {
          return _this.message = JSON.parse(event.data);
        };
        this.worker.postMessage("start");
      } else {
        if (typeof console !== "undefined" && console !== null) {
          console.warn("Your browser doesn't support the worker api");
        }
      }
      return this;
    };

    SpeedTester.prototype.oncomplete = function(handler) {
      var _this = this;
      if (typeof Worker === "undefined" || Worker === null) {
        return;
      }
      if (!handler || typeof handler !== 'function') {
        throw new Error('You must provide a valid handler');
      }
      if (this.message != null) {
        return handler(this.message);
      } else {
        return setTimeout(function() {
          return _this.oncomplete(handler);
        }, 100);
      }
    };

    return SpeedTester;

  })();

}).call(this);
