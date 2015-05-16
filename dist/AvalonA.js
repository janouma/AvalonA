/* AvalonA 0.10.2*/


(function() {
  var defineAvalonA, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  console.log('%cAvalonA 0.10.2', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;');

  defineAvalonA = function(TweenLite) {
    var ActiveArea, Frame3d;
    ActiveArea = (function() {
      var dimensionPattern, validDimension;

      dimensionPattern = /^\d+(%|px)?$/gi;

      validDimension = function(dimension) {
        var result;
        dimensionPattern.lastIndex = 0;
        result = dimensionPattern.test(dimension);
        dimensionPattern.lastIndex = 0;
        return result;
      };

      ActiveArea.prototype.assertValid = function() {
        var errors, _ref;
        errors = ['The following validation errors occured:'];
        if (typeof this.position !== 'object') {
          if (this.position !== 'auto') {
            errors.push("area.position is not valid (" + this.position + ")");
          }
        } else {
          if (this.position.x !== 'auto' && !validDimension(this.position.x)) {
            errors.push("area.position.x is not valid (" + this.position.x + "})");
          }
          if (this.position.y !== 'auto' && !validDimension(this.position.y)) {
            errors.push("area.position.y is not valid (" + this.position.y + "})");
          }
        }
        if ((_ref = this.attachment) !== 'fixed' && _ref !== 'scroll') {
          errors.push("area.attachment is not valid (" + this.attachment + ")");
        }
        if (!validDimension(this.area.width)) {
          errors.push("area.width is not valid (" + this.area.width + ")");
        }
        if (!validDimension(this.area.height)) {
          errors.push("area.height is not valid (" + this.area.height + ")");
        }
        if (errors.length > 1) {
          throw new Error(errors.join("\n"));
        }
      };

      ActiveArea.prototype.processActiveArea = function() {
        this.width = parseInt(this.area.width, 10);
        this.widthIsFluid = dimensionPattern.exec(this.area.width)[1] === '%';
        dimensionPattern.lastIndex = 0;
        this.height = parseInt(this.area.height, 10);
        this.heightIsFluid = dimensionPattern.exec(this.area.height)[1] === '%';
        dimensionPattern.lastIndex = 0;
        if (typeof this.position === 'object') {
          if (this.position.x !== 'auto') {
            this.x = parseInt(this.position.x, 10);
          }
          if (this.position.y !== 'auto') {
            return this.y = parseInt(this.position.y, 10);
          }
        }
      };

      ActiveArea.prototype.init = function(frame) {
        var frameScrollCount, resizeDebugCode, scrollDebugCode, self, windowScrollCount, xBaseComputation, yBaseComputation,
          _this = this;
        this.frame = frame;
        if (!this.frame) {
          throw new Error("frame argument cannot be null");
        }
        this.xBase = (xBaseComputation = this.getXBaseComputation())();
        this.yBase = (yBaseComputation = this.getYBaseComputation())();
        if (this.widthIsFluid) {
          this.xMaxComputation = function() {
            return this.xMin + (this.width / 100) * parseInt(getComputedStyle(this.frame).width, 10);
          };
        } else {
          this.xMaxComputation = function() {
            return this.xMin + this.width;
          };
        }
        if (this.heightIsFluid) {
          this.yMaxComputation = function() {
            return this.yMin + (this.height / 100) * parseInt(getComputedStyle(this.frame).height, 10);
          };
        } else {
          this.yMaxComputation = function() {
            return this.yMin + this.height;
          };
        }
        if (this.attachment === 'fixed') {
          this.xPadding = this.frame.scrollLeft;
          this.yPadding = this.frame.scrollTop;
          if (this.debug === true) {
            console.log("Listen to scroll event");
            self = this;
            scrollDebugCode = function() {
              return console.log("Scroll : @xPadding = " + self.xPadding + ", @yPadding = " + self.yPadding);
            };
          } else {
            scrollDebugCode = function() {};
          }
          windowScrollCount = 0;
          window.addEventListener('scroll', function() {
            if (++windowScrollCount % 5 > 0) {
              return;
            }
            _this.xPadding = window.pageXOffset;
            _this.yPadding = window.pageYOffset;
            _this.refreshBounds();
            return scrollDebugCode();
          }, false);
          frameScrollCount = 0;
          this.frame.addEventListener('scroll', function() {
            if (++frameScrollCount % 5 > 0) {
              return;
            }
            _this.xPadding = _this.frame.scrollLeft;
            _this.yPadding = _this.frame.scrollTop;
            _this.refreshBounds();
            return scrollDebugCode();
          }, false);
        } else {
          this.xPadding = this.yPadding = 0;
        }
        if (this.debug === true) {
          self = this;
          resizeDebugCode = function() {
            return console.log("Resize : @frame.style.width = " + (getComputedStyle(self.frame).width) + ", @frame.style.height = " + (getComputedStyle(self.frame).height));
          };
        } else {
          resizeDebugCode = function() {};
        }
        window.addEventListener('resize', function() {
          _this.xBase = xBaseComputation();
          _this.yBase = yBaseComputation();
          _this.refreshBounds();
          return resizeDebugCode();
        }, false);
        return this.refreshBounds();
      };

      ActiveArea.prototype.refreshBounds = function() {
        this.xMin = this.xBase + this.xPadding;
        this.xMax = this.xMaxComputation();
        this.yMin = this.yBase + this.yPadding;
        return this.yMax = this.yMaxComputation();
      };

      ActiveArea.prototype.bounds = function() {
        return {
          xMin: this.xMin,
          xMax: this.xMax,
          yMin: this.yMin,
          yMax: this.yMax
        };
      };

      ActiveArea.prototype.getXBaseComputation = function() {
        var frameWidth, xBaseComputation,
          _this = this;
        frameWidth = parseInt(getComputedStyle(this.frame).width, 10);
        if (this.position.x && this.position.x !== 'auto') {
          if (dimensionPattern.exec(this.position.x)[1] === '%') {
            xBaseComputation = function() {
              return (_this.x / 100) * frameWidth;
            };
          } else {
            xBaseComputation = function() {
              return _this.x;
            };
          }
          dimensionPattern.lastIndex = 0;
        } else {
          if (this.widthIsFluid) {
            xBaseComputation = function() {
              return ((50 - _this.width / 2) / 100) * frameWidth;
            };
          } else {
            xBaseComputation = function() {
              return frameWidth / 2 - _this.width / 2;
            };
          }
        }
        return xBaseComputation;
      };

      ActiveArea.prototype.getYBaseComputation = function() {
        var frameHeight, yBaseComputation,
          _this = this;
        frameHeight = parseInt(getComputedStyle(this.frame).height, 10);
        if (this.position.y && this.position.y !== 'auto') {
          if (dimensionPattern.exec(this.position.y)[1] === '%') {
            yBaseComputation = function() {
              return (_this.y / 100) * frameHeight;
            };
          } else {
            yBaseComputation = function() {
              return _this.y;
            };
          }
          dimensionPattern.lastIndex = 0;
        } else {
          if (this.heightIsFluid) {
            yBaseComputation = function() {
              return ((50 - _this.height / 2) / 100) * frameHeight;
            };
          } else {
            yBaseComputation = function() {
              return frameHeight / 2 - _this.height / 2;
            };
          }
        }
        return yBaseComputation;
      };

      ActiveArea.prototype.mouseover = function(event) {
        var _ref, _ref1;
        return (this.xMin <= (_ref = event.pageX) && _ref <= this.xMax) && (this.yMin <= (_ref1 = event.pageY) && _ref1 <= this.yMax);
      };

      function ActiveArea(area) {
        var _base, _base1;
        this.area = area;
        if (!this.area) {
          throw new Error("area argument is missing");
        }
        this.position = this.area.position || 'auto';
        if (typeof this.position === 'object') {
          if ((_base = this.position).x == null) {
            _base.x = 'auto';
          }
          if ((_base1 = this.position).y == null) {
            _base1.y = 'auto';
          }
          if (this.position.x === 'auto' && this.position.y === 'auto') {
            this.position = 'auto';
          }
        }
        this.attachment = this.area.attachment || 'fixed';
        this.assertValid();
        this.processActiveArea();
      }

      return ActiveArea;

    })();
    Frame3d = (function() {
      var cssBackUpAttribute, debugName, detectTransformStyleSupport, getTransformStyle, noeffect, transformStyleIsSupported, transitionDuration;

      transitionDuration = 0.75;

      noeffect = function(rotation) {
        return rotation;
      };

      transformStyleIsSupported = void 0;

      cssBackUpAttribute = 'data-css-backup';

      detectTransformStyleSupport = function() {
        var element;
        if (transformStyleIsSupported === void 0) {
          element = document.createElement('b');
          element.id = 'avalona-detection-element';
          element.style.position = 'absolute';
          element.style.top = 0;
          element.style.left = 0;
          document.body.appendChild(element);
          element.style.webkitTransformStyle = 'preserve-3d';
          element.style.MozTransformStyle = 'preserve-3d';
          element.style.msTransformStyle = 'preserve-3d';
          element.style.transformStyle = 'preserve-3d';
          transformStyleIsSupported = getTransformStyle(element) === 'preserve-3d';
          document.body.removeChild(element);
        }
        return transformStyleIsSupported;
      };

      getTransformStyle = function(element) {
        var computedStyle;
        computedStyle = getComputedStyle(element, null);
        return computedStyle.getPropertyValue('-webkit-transform-style') || computedStyle.getPropertyValue('-moz-transform-style') || computedStyle.getPropertyValue('-ms-transform-style') || computedStyle.getPropertyValue('transform-style');
      };

      debugName = function(node) {
        return "" + node.tagName + "(" + (node.id || node.getAttribute('class') || node.getAttribute('href')) + ")";
      };

      Frame3d.prototype.find3dFrames = function() {
        this.frame = document.getElementById(this.frameId);
        this.transformedLayer = this.frame.querySelector("#" + this.layerId);
        if (this.debug === true) {
          console.log("@transformAttribute: " + this.transformAttribute);
          console.log("@layerId: " + this.layerId);
        }
        if (!this.frame) {
          throw new Error("Cannot find 3d frame '#" + this.frameId + "' in dom");
        }
        if (!this.transformedLayer) {
          throw new Error("Cannot find 3d inner frame '#" + this.frameId + " > #" + this.layerId + "' in dom");
        }
      };

      Frame3d.prototype.addPerspective = function() {
        return TweenLite.set(this.transformedLayer, {
          css: {
            perspective: 1000
          }
        });
      };

      Frame3d.prototype.removePerspective = function() {
        return TweenLite.set(this.transformedLayer, {
          css: {
            perspective: 'none'
          }
        });
      };

      Frame3d.prototype.trackMouseMovements = function() {
        var activeAreaPlaceholder, activeAreaPlaceholderId, rule, value, _ref;
        if (this.debug === true && this.activeArea) {
          activeAreaPlaceholderId = 'avalona-active-area';
          activeAreaPlaceholder = document.getElementById(activeAreaPlaceholderId) || document.createElement('div');
          activeAreaPlaceholder.textContent = 'AvalonA Active Area';
          activeAreaPlaceholder.id = activeAreaPlaceholderId;
          _ref = {
            'background-color': 'hotpink',
            'opacity': 0.5,
            'pointer-events': 'none',
            'position': 'absolute',
            'visibility': 'hidden',
            'z-index': 10000
          };
          for (rule in _ref) {
            value = _ref[rule];
            activeAreaPlaceholder.style.setProperty(rule, value);
          }
          document.body.appendChild(activeAreaPlaceholder);
          this.debugMouseMove = function() {
            var bounds, _ref1, _results;
            console.log("rotationX: " + this.rotationX + ", rotationY: " + this.rotationY);
            bounds = this.activeArea.bounds();
            _ref1 = {
              visibility: 'visible',
              left: "" + bounds.xMin + "px",
              top: "" + bounds.yMin + "px",
              width: "" + (bounds.xMax - bounds.xMin) + "px",
              height: "" + (bounds.yMax - bounds.yMin) + "px"
            };
            _results = [];
            for (rule in _ref1) {
              value = _ref1[rule];
              _results.push(activeAreaPlaceholder.style.setProperty(rule, value));
            }
            return _results;
          };
        } else {
          this.debugMouseMove = function() {};
        }
        if (this.activeArea) {
          this.activeArea.init(this.frame);
        } else {
          this.frame.addEventListener('mouseleave', function(e) {
            if (e.target.id === this.frameId) {
              return this.mouseout();
            }
          }, false);
        }
        return this.frame.addEventListener('mousemove', this.mousemove, false);
      };

      Frame3d.prototype.mouseout = function() {
        return this.disableRotation();
      };

      Frame3d.prototype.mouseMoveCount = 0;

      Frame3d.prototype.mousemove = function(event) {
        if (++this.mouseMoveCount % 5 > 0) {
          return;
        }
        if (!this.activeArea || this.activeArea.mouseover(event)) {
          this.onrotation();
          this.rotationY = (event.pageX - window.innerWidth / 2) / 25;
          this.rotationX = -1 * (event.pageY - window.innerHeight / 2) / 15;
          this.debugMouseMove();
          return TweenLite.to(this.transformedLayer, 0.1, {
            css: {
              rotationX: this.fy(this.rotationX),
              rotationY: this.fx(this.rotationY)
            }
          });
        } else {
          return this.disableRotation();
        }
      };

      Frame3d.prototype.onrotation = function() {
        var _ref;
        clearTimeout(this.rotationTimeoutId);
        if (!this.rotating) {
          if ((_ref = this.animation) != null) {
            _ref.pause();
          }
          if (typeof this.onstartrotation === "function") {
            this.onstartrotation();
          }
          this.rotating = true;
        }
        if (this.idleTimeout > 0) {
          return this.rotationTimeoutId = setTimeout(this.stopRotation, this.idleTimeout);
        }
      };

      Frame3d.prototype.stopRotation = function() {
        var _ref;
        clearTimeout(this.rotationTimeoutId);
        if (this.rotating) {
          this.rotating = false;
          if (typeof this.onendrotation === "function") {
            this.onendrotation();
          }
          return (_ref = this.animation) != null ? _ref.play() : void 0;
        }
      };

      Frame3d.prototype.disableRotation = function(duration) {
        if (duration == null) {
          duration = 1;
        }
        if ((this.rotationX || this.rotationY) && (this.animation == null)) {
          this.resetRotation(duration);
        }
        return this.stopRotation();
      };

      Frame3d.prototype.resetRotation = function(duration) {
        if (duration == null) {
          duration = 1;
        }
        clearTimeout(this.rotationTimeoutId);
        this.rotationX = this.rotationY = 0;
        return TweenLite.to(this.transformedLayer, duration, {
          css: {
            rotationX: 0,
            rotationY: 0
          }
        });
      };

      Frame3d.prototype.resetTransform = function() {
        var rule, value, _ref, _results;
        clearTimeout(this.rotationTimeoutId);
        this.rotationX = this.rotationY = 0;
        _ref = {
          '-webkit-transform': 'none',
          '-moz-transform': 'none',
          '-o-transform': 'none',
          '-ms-transform': 'none',
          'transform': 'none'
        };
        _results = [];
        for (rule in _ref) {
          value = _ref[rule];
          _results.push(this.transformedLayer.style.setProperty(rule, value));
        }
        return _results;
      };

      Frame3d.prototype.untrackMouseMovements = function() {
        var _ref, _ref1;
        if ((_ref = this.frame) != null) {
          _ref.removeEventListener("mousemove", this.mousemove);
        }
        return (_ref1 = this.frame) != null ? _ref1.removeEventListener("mouseleave", this.mouseout) : void 0;
      };

      Frame3d.prototype.refreshTransform = function(node) {
        var child, target, _i, _len, _ref, _results;
        if (node == null) {
          node = null;
        }
        if (this.disabled === true) {
          return;
        }
        if (node == null) {
          node = this.transformedLayer;
        }
        target = typeof node === 'string' ? this.transformedLayer.querySelector(node) : node;
        if (this.debug === true) {
          console.log("target: " + (debugName(target)));
        }
        this.applyTransformOn(target);
        if (this.debug === true) {
          console.log("refreshTransform firstChild: " + (debugName(target.firstElementChild)));
        }
        _ref = target.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(this.refreshChildTransform(child));
        }
        return _results;
      };

      Frame3d.prototype.refreshChildTransform = function(child) {
        if (!child) {
          throw new Error("refreshChildTransform child argument cannot be null");
        }
        if (child.querySelectorAll("[" + this.transformAttribute + "]").length) {
          if (this.debug === true) {
            console.log("refreshTransform child " + (debugName(child)) + " has children");
          }
          this.refreshTransform(child);
        } else if (child.getAttribute(this.transformAttribute)) {
          if (this.debug === true) {
            console.log("refreshTransform child " + (debugName(child)) + " has '" + this.transformAttribute + "'");
          }
          this.applyTransformOn(child);
        }
        return child;
      };

      Frame3d.prototype.applyTransformOn = function(target) {
        var attrValue, backup, css, prop, rx, ry, rz, t, targetStyle, transformBackup, transforms, value, z, _i, _len, _ref, _ref1;
        if (!target) {
          throw new Error("applyTransformOn target argument cannot be null");
        }
        if (!target.getAttribute(cssBackUpAttribute)) {
          targetStyle = getComputedStyle(target);
          backup = {
            transformStyle: getTransformStyle(target) || 'flat',
            overflow: targetStyle.overflow || 'inherit'
          };
          transformBackup = targetStyle.getPropertyValue('-webkit-transform') || targetStyle.getPropertyValue('-moz-transform') || targetStyle.getPropertyValue('-o-transform') || targetStyle.getPropertyValue('-ms-transform') || targetStyle.getPropertyValue('transform');
          if (transformBackup) {
            backup.transform = transformBackup;
          }
          target.setAttribute(cssBackUpAttribute, JSON.stringify(backup));
        }
        TweenLite.set(target, {
          css: {
            transformStyle: 'preserve-3d',
            overflow: 'visible'
          }
        });
        if ((attrValue = target.getAttribute(this.transformAttribute))) {
          transforms = {};
          _ref = attrValue.split(';');
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            t = _ref[_i];
            _ref1 = t.split(':'), prop = _ref1[0], value = _ref1[1];
            transforms[prop.trim()] = parseInt(value.trim(), 10);
          }
          z = transforms.z, rx = transforms.rx, ry = transforms.ry, rz = transforms.rz;
          if (z || rx || ry || rz) {
            css = {};
            if (z) {
              css.z = z;
            }
            if (rx) {
              css.rotationX = rx;
            }
            if (ry) {
              css.rotationY = ry;
            }
            if (rz) {
              css.rotationZ = rz;
            }
            return TweenLite.to(target, transitionDuration, {
              css: css
            });
          }
        }
      };

      Frame3d.prototype.refresh = function() {
        var _ref, _ref1;
        this.disabled = false;
        if (this.frame) {
          this.untrackMouseMovements();
          if ((_ref = this.animation) != null) {
            _ref.pause();
          }
        }
        this.find3dFrames();
        this.addPerspective();
        this.refreshTransform();
        this.trackMouseMovements();
        return (_ref1 = this.animation) != null ? _ref1.play(this.transformedLayer, this.transformAttribute) : void 0;
      };

      Frame3d.prototype.start = function() {
        return this.refresh();
      };

      Frame3d.prototype.enable = function() {
        return this.refresh();
      };

      Frame3d.prototype.disable = function() {
        var _ref;
        if (this.frame) {
          this.untrackMouseMovements();
          this.disableRotationEvent();
          if ((_ref = this.animation) != null) {
            _ref.pause();
          }
          this.flatten();
          this.removePerspective();
        }
        return this.disabled = true;
      };

      Frame3d.prototype.disableRotationEvent = function() {
        clearTimeout(this.rotationTimeoutId);
        this.rotating = false;
        return typeof this.onendrotation === "function" ? this.onendrotation() : void 0;
      };

      Frame3d.prototype.flatten = function() {
        var css, node, _i, _len, _ref, _results;
        this.resetTransform();
        _ref = this.transformedLayer.querySelectorAll("[" + cssBackUpAttribute + "]");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          if (this.debug === true) {
            console.log("flattening layer '" + (debugName(node)) + "'");
          }
          css = JSON.parse(node.getAttribute(cssBackUpAttribute));
          _results.push(TweenLite.set(node, {
            css: css
          }));
        }
        return _results;
      };

      Frame3d.prototype.init = function(options) {
        var _ref, _ref1, _ref2;
        this.transformAttribute = options.tAttr || 'data-avalonA-transform';
        this.fx = typeof options.fx === 'function' ? options.fx : noeffect;
        this.fy = typeof options.fy === 'function' ? options.fy : noeffect;
        if (options.activeArea) {
          this.activeArea = new ActiveArea(options.activeArea);
        }
        if ((_ref = this.activeArea) != null) {
          _ref.debug = this.debug;
        }
        this.onstartrotation = (_ref1 = options.on) != null ? _ref1.startrotation : void 0;
        this.onendrotation = (_ref2 = options.on) != null ? _ref2.endrotation : void 0;
        this.animation = options.animation;
        this.idleTimeout = parseInt(options.idleTimeout || 1000, 10);
        if (this.animation) {
          return this.assertAnimatorValid();
        }
      };

      Frame3d.prototype.assertAnimatorValid = function() {
        if (!this.animation.play || typeof this.animation.play !== 'function') {
          throw new Error("animation.play must be a function");
        }
        if (!this.animation.pause || typeof this.animation.pause !== 'function') {
          throw new Error("animation.pause must be a function");
        }
      };

      function Frame3d(frameId, layerId, options) {
        this.frameId = frameId;
        this.layerId = layerId;
        if (options == null) {
          options = {};
        }
        this.refreshChildTransform = __bind(this.refreshChildTransform, this);
        this.stopRotation = __bind(this.stopRotation, this);
        this.mousemove = __bind(this.mousemove, this);
        this.mouseout = __bind(this.mouseout, this);
        if (!this.frameId) {
          throw new Error("frameId argument cannot be null");
        }
        if (!this.layerId) {
          throw new Error("layerId argument cannot be null");
        }
        this.debug = options.debug;
        detectTransformStyleSupport();
        if (this.debug === true) {
          console.log("transformStyleIsSupported: " + transformStyleIsSupported);
        }
        if (transformStyleIsSupported) {
          this.init(options);
        } else {
          this.flatten = this.disableRotationEvent = this.disable = this.start = this.enable = this.refresh = this.applyTransformOn = this.refreshChildTransform = this.refreshTransform = this.untrackMouseMovements = this.trackMouseMovements = this.addPerspective = this.removePerspective = function() {};
        }
      }

      return Frame3d;

    })();
    return function(frameId, layerId, debug) {
      if (debug == null) {
        debug = false;
      }
      return new Frame3d(frameId, layerId, debug);
    };
  };

  /* Export*/


  if (typeof define === 'function' && define.amd) {
    define('AvalonA', ['tweenlite'], function(tweenlite) {
      return defineAvalonA(tweenlite);
    });
  } else {
    window.AvalonA = defineAvalonA(((_ref = window.GreenSockGlobals) != null ? _ref.TweenLite : void 0) || TweenLite);
  }

}).call(this);
