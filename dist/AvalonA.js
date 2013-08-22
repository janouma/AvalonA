/* AvalonA 0.7.4*/


(function() {
  var ActiveArea, Frame3d,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
          return this.xMin + (this.width / 100) * this.frame.width();
        };
      } else {
        this.xMaxComputation = function() {
          return this.xMin + this.width;
        };
      }
      if (this.heightIsFluid) {
        this.yMaxComputation = function() {
          return this.yMin + (this.height / 100) * this.frame.height();
        };
      } else {
        this.yMaxComputation = function() {
          return this.yMin + this.height;
        };
      }
      if (this.attachment === 'fixed') {
        this.xPadding = this.frame.prop('scrollLeft');
        this.yPadding = this.frame.prop('scrollTop');
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
        $(window).scroll(function() {
          if (++windowScrollCount % 5 > 0) {
            return;
          }
          _this.xPadding = $(window).prop('pageXOffset');
          _this.yPadding = $(window).prop('pageYOffset');
          _this.refreshBounds();
          return scrollDebugCode();
        });
        frameScrollCount = 0;
        this.frame.scroll(function() {
          if (++frameScrollCount % 5 > 0) {
            return;
          }
          _this.xPadding = _this.frame.prop('scrollLeft');
          _this.yPadding = _this.frame.prop('scrollTop');
          _this.refreshBounds();
          return scrollDebugCode();
        });
      } else {
        this.xPadding = this.yPadding = 0;
      }
      if (this.debug === true) {
        self = this;
        resizeDebugCode = function() {
          return console.log("Resize : @frame.width() = " + (self.frame.width()) + ", @frame.height() = " + (self.frame.height()));
        };
      } else {
        resizeDebugCode = function() {};
      }
      $(window).resize(function() {
        _this.xBase = xBaseComputation();
        _this.yBase = yBaseComputation();
        _this.refreshBounds();
        return resizeDebugCode();
      });
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
      var xBaseComputation,
        _this = this;
      if (this.position.x && this.position.x !== 'auto') {
        if (dimensionPattern.exec(this.position.x)[1] === '%') {
          xBaseComputation = function() {
            return (_this.x / 100) * _this.frame.width();
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
            return ((50 - _this.width / 2) / 100) * _this.frame.width();
          };
        } else {
          xBaseComputation = function() {
            return _this.frame.width() / 2 - _this.width / 2;
          };
        }
      }
      return xBaseComputation;
    };

    ActiveArea.prototype.getYBaseComputation = function() {
      var yBaseComputation,
        _this = this;
      if (this.position.y && this.position.y !== 'auto') {
        if (dimensionPattern.exec(this.position.y)[1] === '%') {
          yBaseComputation = function() {
            return (_this.y / 100) * _this.frame.height();
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
            return ((50 - _this.height / 2) / 100) * _this.frame.height();
          };
        } else {
          yBaseComputation = function() {
            return _this.frame.height() / 2 - _this.height / 2;
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

    transformStyleIsSupported = null;

    cssBackUpAttribute = 'data-css-backup';

    detectTransformStyleSupport = function() {
      var body, element, id, _ref, _ref1, _ref2, _ref3;
      if (transformStyleIsSupported === null) {
        id = 'avalona-detection-element';
        body = $('body').prepend("<b id='" + id + "' style='position:absolute; top:0; left:0;'></b>");
        element = $("#" + id);
        if ((_ref = element[0].style) != null) {
          _ref.webkitTransformStyle = 'preserve-3d';
        }
        if ((_ref1 = element[0].style) != null) {
          _ref1.MozTransformStyle = 'preserve-3d';
        }
        if ((_ref2 = element[0].style) != null) {
          _ref2.msTransformStyle = 'preserve-3d';
        }
        if ((_ref3 = element[0].style) != null) {
          _ref3.transformStyle = 'preserve-3d';
        }
        transformStyleIsSupported = getTransformStyle(element[0]) === 'preserve-3d';
        element.remove();
      }
      return transformStyleIsSupported;
    };

    getTransformStyle = function(element) {
      var computedStyle;
      computedStyle = getComputedStyle(element, null);
      return computedStyle.getPropertyValue('-webkit-transform-style') || computedStyle.getPropertyValue('-moz-transform-style') || computedStyle.getPropertyValue('-ms-transform-style') || computedStyle.getPropertyValue('transform-style');
    };

    debugName = function(node) {
      return "" + (node.prop('tagName')) + "(" + (node.attr('id') || node.attr('class') || node.attr('href')) + ")";
    };

    Frame3d.prototype.find3dFrames = function() {
      this.frame = $("#" + this.id);
      this.transformedLayer = $("." + this.cssClass, this.frame).eq(0);
      if (this.debug === true) {
        console.log("@deepnessAttribute: " + this.deepnessAttribute);
        console.log("@cssClass: " + this.cssClass);
      }
      if (!this.frame.size()) {
        throw new Error("Cannot find 3d frame '#" + this.id + "' in dom");
      }
      if (!this.transformedLayer.size()) {
        throw new Error("Cannot find 3d inner frame '#" + this.id + " ." + this.cssClass + "' in dom");
      }
    };

    Frame3d.prototype.addPerspective = function() {
      return TweenLite.set(this.transformedLayer[0], {
        css: {
          transformPerspective: 1000
        }
      });
    };

    Frame3d.prototype.removePerspective = function() {
      return TweenLite.set(this.transformedLayer[0], {
        css: {
          transformPerspective: 'none'
        }
      });
    };

    Frame3d.prototype.trackMouseMovements = function() {
      var activeAreaPlaceholder;
      if (this.debug === true) {
        $('body').append("<div id='avalona-active-area' style='background-color:hotpink;opacity:0.75;pointer-events:none;position:absolute;visibility:hidden;z-index:10000;'>AvalonA Active Area</div>");
        activeAreaPlaceholder = $('#avalona-active-area');
        this.debugMouseMove = function() {
          var bounds;
          console.log("rotationX: " + this.rotationX + ", rotationY: " + this.rotationY);
          bounds = this.activeArea.bounds();
          return activeAreaPlaceholder.css({
            visibility: 'visible',
            left: "" + bounds.xMin + "px",
            top: "" + bounds.yMin + "px",
            width: "" + (bounds.xMax - bounds.xMin) + "px",
            height: "" + (bounds.yMax - bounds.yMin) + "px"
          });
        };
      } else {
        this.debugMouseMove = function() {};
      }
      if (this.activeArea) {
        this.activeArea.init(this.frame);
      } else {
        this.frame.on("mouseleave", "#" + this.id, this.mouseout);
      }
      return this.frame.mousemove(this.mousemove);
    };

    Frame3d.prototype.mouseout = function() {
      return this.cancelRotation();
    };

    Frame3d.prototype.mouseMoveCount = 0;

    Frame3d.prototype.mousemove = function(event) {
      if (++this.mouseMoveCount % 5 > 0) {
        return;
      }
      if (!this.activeArea || this.activeArea.mouseover(event)) {
        this.onrotation();
        this.rotationY = (event.pageX - $(window).prop('innerWidth') / 2) / 25;
        this.rotationX = -1 * (event.pageY - $(window).prop('innerHeight') / 2) / 15;
        this.debugMouseMove();
        return TweenLite.to(this.transformedLayer[0], 0.1, {
          css: {
            rotationX: this.fy(this.rotationX),
            rotationY: this.fx(this.rotationY)
          }
        });
      } else {
        return this.cancelRotation();
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
      return this.rotationTimeoutId = setTimeout(this.stopRotation, 1000);
    };

    Frame3d.prototype.stopRotation = function() {
      var _ref;
      if (this.rotating) {
        this.rotating = false;
        if (typeof this.onendrotation === "function") {
          this.onendrotation();
        }
        return (_ref = this.animation) != null ? _ref.play() : void 0;
      }
    };

    Frame3d.prototype.cancelRotation = function(duration) {
      if (duration == null) {
        duration = 1;
      }
      switch (false) {
        case this.animation == null:
          clearTimeout(this.rotationTimeoutId);
          return this.stopRotation();
        case !(this.rotationX || this.rotationY):
          this.rotationX = this.rotationY = 0;
          return TweenLite.to(this.transformedLayer[0], duration, {
            css: {
              rotationX: 0,
              rotationY: 0
            }
          });
      }
    };

    Frame3d.prototype.untrackMouseMovements = function() {
      var _ref, _ref1;
      if ((_ref = this.frame) != null) {
        _ref.off("mousemove", this.mousemove);
      }
      return (_ref1 = this.frame) != null ? _ref1.off("mouseleave", this.mouseout) : void 0;
    };

    Frame3d.prototype.zRefresh = function(node) {
      var firstChild, self, target;
      if (node == null) {
        node = null;
      }
      if (this.disabled === true) {
        return;
      }
      self = this;
      if (node == null) {
        node = this.transformedLayer;
      }
      target = typeof node === 'string' ? $(target, this.transformedLayer) : $(node);
      if (this.debug === true) {
        console.log("target: " + (debugName(target)));
      }
      this.setZOf(target);
      firstChild = target.children().eq(0);
      if (this.debug === true) {
        console.log("zRefresh firstChild: " + (debugName(firstChild)));
      }
      return this.zRefreshChild(firstChild).siblings().each(function() {
        return self.zRefreshChild($(this));
      });
    };

    Frame3d.prototype.zRefreshChild = function(child) {
      if (!child) {
        throw new Error("zRefreshChild child argument cannot be null");
      }
      if ($("[" + this.deepnessAttribute + "]", child).length) {
        if (this.debug === true) {
          console.log("zRefresh child " + (debugName(child)) + " has children");
        }
        this.zRefresh(child);
      } else if (child.attr(this.deepnessAttribute)) {
        if (this.debug === true) {
          console.log("zRefresh child " + (debugName(child)) + " has '" + this.deepnessAttribute + "'");
        }
        this.setZOf(child);
      }
      return child;
    };

    Frame3d.prototype.setZOf = function(target) {
      var backup, z;
      if (!target) {
        throw new Error("setZOf target argument cannot be null");
      }
      if (!target.attr(cssBackUpAttribute)) {
        backup = {
          transformStyle: getTransformStyle(target[0]) || 'flat',
          overflow: target.css('overflow') || 'inherit'
        };
        target.attr(cssBackUpAttribute, JSON.stringify(backup));
      }
      TweenLite.set(target[0], {
        css: {
          transformStyle: 'preserve-3d',
          overflow: 'visible'
        }
      });
      z = target.attr(this.deepnessAttribute);
      if (z) {
        return TweenLite.to(target[0], transitionDuration, {
          css: {
            z: z
          }
        });
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
      this.zRefresh();
      this.trackMouseMovements();
      return (_ref1 = this.animation) != null ? _ref1.play(this.transformedLayer[0]) : void 0;
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
        this.cancelRotationEvent();
        if ((_ref = this.animation) != null) {
          _ref.pause();
        }
        this.flatten();
        this.removePerspective();
      }
      return this.disabled = true;
    };

    Frame3d.prototype.cancelRotationEvent = function() {
      clearTimeout(this.rotationTimeoutId);
      this.rotating = false;
      return typeof this.onendrotation === "function" ? this.onendrotation() : void 0;
    };

    Frame3d.prototype.flatten = function() {
      var self;
      this.cancelRotation(0);
      self = this;
      return $("[" + cssBackUpAttribute + "]").each(function() {
        var css;
        if (self.debug === true) {
          console.log("flattening layer '" + (debugName($(this))) + "'");
        }
        css = JSON.parse($(this).attr(cssBackUpAttribute));
        if ($(this).attr(self.deepnessAttribute)) {
          css.z = 0;
        }
        return TweenLite.set(this, {
          css: css
        });
      });
    };

    Frame3d.prototype.init = function(options) {
      var _ref, _ref1, _ref2;
      this.deepnessAttribute = options.zAttr || 'data-avalonA-deepness';
      this.cssClass = options["class"] || 'avalona-inner-frame';
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

    function Frame3d(id, options) {
      this.id = id;
      if (options == null) {
        options = {};
      }
      this.zRefreshChild = __bind(this.zRefreshChild, this);
      this.stopRotation = __bind(this.stopRotation, this);
      this.mousemove = __bind(this.mousemove, this);
      this.mouseout = __bind(this.mouseout, this);
      this.debug = options.debug;
      detectTransformStyleSupport();
      if (this.debug === true) {
        console.log("transformStyleIsSupported: " + transformStyleIsSupported);
      }
      if (transformStyleIsSupported) {
        this.init(options);
      } else {
        this.flatten = this.cancelRotationEvent = this.disable = this.start = this.enable = this.refresh = this.setZOf = this.zRefreshChild = this.zRefresh = this.untrackMouseMovements = this.trackMouseMovements = this.addPerspective = this.removePerspective = function() {};
      }
    }

    return Frame3d;

  })();

  /* Export*/


  window.AvalonA = function(id, debug) {
    if (debug == null) {
      debug = false;
    }
    return new Frame3d(id, debug);
  };

}).call(this);
