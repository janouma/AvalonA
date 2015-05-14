/* AvalonAnimation 0.9.1*/


(function() {
  var defineAvalonAnimation, _ref, _ref1, _ref2, _ref3,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  console.log('%cAvalonAnimation 0.9.1', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;');

  defineAvalonAnimation = function(TweenMax, TweenLite, GSEases) {
    var Linear, Power1;
    Power1 = GSEases.Power1;
    Linear = GSEases.Linear;
    return {
      /* Balance*/

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
          play: function(transformedLayer) {
            var _this = this;
            if (transformedLayer) {
              this.animatedObject = transformedLayer;
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
      /* Spotlight*/

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
          play: function(transformedLayer) {
            var _this = this;
            if (transformedLayer) {
              this.animatedObject = transformedLayer;
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
      },
      /* Atom*/

      Atom: function(options) {
        var a, allowedAxis, axis, css, duration, selector, _i, _len, _ref;
        if (options == null) {
          options = {};
        }
        duration = options.duration, selector = options.selector, axis = options.axis;
        allowedAxis = ['x', 'y', 'z'];
        css = {};
        if (!axis || !axis.length) {
          axis = allowedAxis;
        }
        for (_i = 0, _len = axis.length; _i < _len; _i++) {
          a = axis[_i];
          if (axis !== allowedAxis) {
            if (_ref = !a, __indexOf.call(allowedAxis, _ref) >= 0) {
              throw Error("Revolution.axis is not valid");
            }
          }
          css["rotation" + (a.toUpperCase())] = '+=360';
        }
        duration = duration == null ? 2.75 : parseFloat(duration);
        if (!duration) {
          throw Error("Revolution.duration is not valid");
        }
        return {
          getTimeline: function() {
            return this.timeline = new TweenMax(this.animatedObject, duration, {
              paused: true,
              css: css,
              repeat: -1,
              ease: Linear.easeNone
            });
          },
          play: function(transformedLayer, transformAttr) {
            var chunk,
              _this = this;
            if (transformedLayer) {
              if (selector) {
                selector = ((function() {
                  var _j, _len1, _ref1, _results;
                  _ref1 = selector.split(',');
                  _results = [];
                  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                    chunk = _ref1[_j];
                    _results.push("" + chunk + ":not([" + transformAttr + "])");
                  }
                  return _results;
                })()).join(',');
                this.animatedObject = transformedLayer.querySelectorAll(selector);
              } else {
                this.animatedObject = transformedLayer;
              }
            }
            if (this.animatedObject) {
              return this.timeline = TweenLite.to(this.animatedObject, duration, {
                overwrite: true,
                css: css,
                ease: Linear.easeNone,
                onComplete: function() {
                  return _this.getTimeline().play();
                }
              });
            }
          },
          pause: function() {
            var _ref1;
            return (_ref1 = this.timeline) != null ? _ref1.pause() : void 0;
          }
        };
      }
    };
  };

  /* Export*/


  if (typeof define === 'function' && define.amd) {
    define('AvalonAnimation', ['tweenmax', 'tweenlite', 'GSEases'], function(tweenmax, tweenlite, GSEases) {
      return defineAvalonAnimation(tweenmax, tweenlite, GSEases);
    });
  } else {
    window.AvalonAnimation = defineAvalonAnimation(((_ref = window.GreenSockGlobals) != null ? _ref.TweenMax : void 0) || TweenMax, ((_ref1 = window.GreenSockGlobals) != null ? _ref1.TweenLite : void 0) || TweenLite, {
      Power1: ((_ref2 = window.GreenSockGlobals) != null ? _ref2.Power1 : void 0) || Power1,
      Linear: ((_ref3 = window.GreenSockGlobals) != null ? _ref3.Linear : void 0) || Linear
    });
  }

}).call(this);
