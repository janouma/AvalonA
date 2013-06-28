
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
      duration = duration == null ? 2.75 : parseFloat(duration);
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
      if (!duration) {
        throw new Error("Balance.duration is not valid");
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
            return this.timeline = TweenLite.to(this.animatedObject, duration, {
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
    },
    /* Spotlight
    */

    Spotlight: function(options) {
      var angle, direction, duration, lastPosition, path;
      if (options == null) {
        options = {};
      }
      direction = options.direction, duration = options.duration, angle = options.angle;
      if (direction == null) {
        direction = 'cw';
      }
      duration = duration == null ? 8 : parseFloat(duration);
      angle = angle == null ? 20 : parseFloat(angle);
      if (direction !== 'cw' && direction !== 'ccw') {
        throw new Error("Spotlight.direction must be either 'cw'(clockwise) or 'ccw'(counter-clockwise)");
      }
      if (!duration) {
        throw new Error("Spotlight.duration is not valid");
      }
      if (!angle || !((0 <= angle && angle <= 180))) {
        throw new Error("Spotlight.angle is not valid");
      }
      path = [
        {
          rotationX: angle,
          rotationY: 0
        }, {
          rotationX: 0,
          rotationY: angle
        }, {
          rotationX: -angle,
          rotationY: 0
        }, {
          rotationX: 0,
          rotationY: -angle
        }, {
          rotationX: angle,
          rotationY: 0
        }
      ];
      if (direction === 'ccw') {
        path = path.reverse();
      }
      lastPosition = path[path.length - 1];
      return {
        getTimeline: function() {
          return this.timeline = new TweenMax(this.animatedObject, duration, {
            paused: true,
            overwrite: true,
            repeat: -1,
            ease: Linear.easeNone,
            bezier: path
          });
        },
        play: function(target) {
          var _this = this;
          if (target) {
            this.animatedObject = target;
          }
          if (this.animatedObject) {
            return this.timeline = TweenLite.to(this.animatedObject, duration / 4, {
              overwrite: true,
              ease: Linear.easeNone,
              bezier: [lastPosition],
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
