
/* AvalonAnimation
*/


(function() {

  window.AvalonAnimation = {
    /* Balance
    */

    Balance: function(options) {
      var duration, from, to;
      if (options == null) {
        options = {};
      }
      from = options.from, to = options.to, duration = options.duration;
      if (from == null) {
        from = {
          rx: 0,
          ry: -20
        };
      }
      if (to == null) {
        to = {
          rx: -from.rx,
          ry: -from.ry
        };
      }
      if (duration == null) {
        duration = 2.75;
      }
      if (from.rx == null) {
        throw new Error("Balance.from.rx cannot be null");
      }
      if (from.ry == null) {
        throw new Error("Balance.from.ry cannot be null");
      }
      if (to.rx == null) {
        throw new Error("Balance.to.rx cannot be null");
      }
      if (to.ry == null) {
        throw new Error("Balance.to.ry cannot be null");
      }
      if (!parseFloat(duration)) {
        throw new Error("Balance.duration cannot be null");
      }
      return {
        getTimeline: function() {
          return this.timeline = new TweenMax(this.animatedObject, duration, {
            paused: true,
            css: {
              rotationX: to.rx,
              rotationY: to.ry
            },
            repeat: -1,
            yoyo: true,
            ease: Power1.easeInOut
          });
        },
        play: function(target) {
          var _this = this;
          if (target) {
            this.animatedObject = target;
          }
          if (this.animatedObject) {
            return TweenLite.to(this.animatedObject, duration, {
              overwrite: true,
              css: {
                rotationX: from.rx,
                rotationY: from.ry
              },
              ease: Power1.easeInOut,
              onComplete: function() {
                return _this.getTimeline().play();
              }
            });
          }
        },
        pause: function() {
          var _ref;
          return (_ref = this.timeline) != null ? _ref.pause() : void 0;
        }
      };
    }
  };

}).call(this);
