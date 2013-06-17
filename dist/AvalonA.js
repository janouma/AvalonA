
/* AvalonA 0.6.0
*/


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
      var self, xBase, xPadding, yBase, yPadding;
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
          this.y = parseInt(this.position.y, 10);
        }
      }
      xBase = this.getXBaseComputation();
      yBase = this.getYBaseComputation();
      self = this;
      if (this.attachment === 'fixed') {
        xPadding = function() {
          return self.frame.prop('scrollLeft');
        };
        yPadding = function() {
          return self.frame.prop('scrollTop');
        };
      } else {
        xPadding = yPadding = function() {
          return 0;
        };
      }
      this.xMin = function() {
        return xBase() + xPadding();
      };
      this.yMin = function() {
        return yBase() + yPadding();
      };
      if (this.widthIsFluid) {
        this.xMax = function() {
          return this.xMin() + (this.width / 100) * this.frame.width();
        };
      } else {
        this.xMax = function() {
          return this.xMin() + this.width;
        };
      }
      if (this.heightIsFluid) {
        return this.yMax = function() {
          return this.yMin() + (this.height / 100) * this.frame.height();
        };
      } else {
        return this.yMax = function() {
          return this.yMin() + this.height;
        };
      }
    };

    ActiveArea.prototype.getXBaseComputation = function() {
      var self, xBase;
      self = this;
      if (this.position.x && this.position.x !== 'auto') {
        if (dimensionPattern.exec(this.position.x)[1] === '%') {
          xBase = function() {
            return (self.x / 100) * self.frame.width();
          };
        } else {
          xBase = function() {
            return self.x;
          };
        }
        dimensionPattern.lastIndex = 0;
      } else {
        if (this.widthIsFluid) {
          xBase = function() {
            return ((50 - self.width / 2) / 100) * self.frame.width();
          };
        } else {
          xBase = function() {
            return self.frame.width() / 2 - self.width / 2;
          };
        }
      }
      return xBase;
    };

    ActiveArea.prototype.getYBaseComputation = function() {
      var self, yBase;
      self = this;
      if (this.position.y && this.position.y !== 'auto') {
        if (dimensionPattern.exec(this.position.y)[1] === '%') {
          yBase = function() {
            return (self.y / 100) * self.frame.height();
          };
        } else {
          yBase = function() {
            return self.y;
          };
        }
        dimensionPattern.lastIndex = 0;
      } else {
        if (this.heightIsFluid) {
          yBase = function() {
            return ((50 - self.height / 2) / 100) * self.frame.height();
          };
        } else {
          yBase = function() {
            return self.frame.height() / 2 - self.height / 2;
          };
        }
      }
      return yBase;
    };

    ActiveArea.prototype.mouseover = function(event) {
      var _ref, _ref1;
      return (this.xMin() <= (_ref = event.pageX) && _ref <= this.xMax()) && (this.yMin() <= (_ref1 = event.pageY) && _ref1 <= this.yMax());
    };

    ActiveArea.prototype.bounds = function() {
      return {
        xMin: this.xMin(),
        xMax: this.xMax(),
        yMin: this.yMin(),
        yMax: this.yMax()
      };
    };

    function ActiveArea(area) {
      var _base, _base1, _ref, _ref1;
      this.area = area;
      if (!this.area) {
        throw new Error("area argument is missing");
      }
      this.position = this.area.position || 'auto';
      if (typeof this.position === 'object') {
        if ((_ref = (_base = this.position).x) == null) {
          _base.x = 'auto';
        }
        if ((_ref1 = (_base1 = this.position).y) == null) {
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
    var debugName, detectTransformStyleSupport, noeffect, transformStyleIsSupported, transitionDuration;

    transitionDuration = 0.75;

    noeffect = function(rotation) {
      return rotation;
    };

    transformStyleIsSupported = null;

    detectTransformStyleSupport = function() {
      var body, computedStyle, element, id, style, _ref, _ref1, _ref2, _ref3;
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
        computedStyle = getComputedStyle(element[0], null);
        style = computedStyle.getPropertyValue('-webkit-transform-style') || computedStyle.getPropertyValue('-moz-transform-style') || computedStyle.getPropertyValue('-ms-transform-style') || computedStyle.getPropertyValue('transform-style');
        transformStyleIsSupported = style === 'preserve-3d';
        element.remove();
      }
      return transformStyleIsSupported;
    };

    debugName = function(node) {
      return "" + (node.prop('tagName')) + "(" + (node.attr('id') || node.attr('class') || node.attr('href')) + ")";
    };

    Frame3d.prototype.find3dFrames = function() {
      this.outerFrameJQueryNode = $("#" + this.id);
      this.innerFrameJQueryNode = $("." + this.cssClass, this.outerFrameJQueryNode).eq(0);
      if (this.debug === true) {
        console.log("@deepnessAttribute: " + this.deepnessAttribute);
        console.log("@cssClass: " + this.cssClass);
      }
      if (!this.outerFrameJQueryNode.size()) {
        throw new Error("Cannot find 3d frame '#" + this.id + "' in dom");
      }
      if (!this.innerFrameJQueryNode.size()) {
        throw new Error("Cannot find 3d inner frame '#" + this.id + " ." + this.cssClass + "' in dom");
      }
    };

    Frame3d.prototype.setPerspective = function() {
      return TweenLite.set(this.innerFrameJQueryNode[0], {
        transformPerspective: 1000
      });
    };

    Frame3d.prototype.trackMouseMovements = function() {
      var activeAreaPlaceholder, debugCode, self,
        _this = this;
      if (this.debug === true) {
        $('body').append("<div id='avalona-active-area' style='background-color:hotpink;opacity:0.75;pointer-events:none;position:absolute;visibility:hidden;z-index:10000;'>AvalonA Active Area</div>");
        activeAreaPlaceholder = $('#avalona-active-area');
        self = this;
        debugCode = function(rotationX, rotationY) {
          var bounds;
          console.log("rotationX: " + rotationX + ", rotationY: " + rotationY);
          bounds = self.activeArea.bounds();
          return activeAreaPlaceholder.css({
            visibility: 'visible',
            left: "" + bounds.xMin + "px",
            top: "" + bounds.yMin + "px",
            width: "" + (bounds.xMax - bounds.xMin) + "px",
            height: "" + (bounds.yMax - bounds.yMin) + "px"
          });
        };
      } else {
        debugCode = function() {};
      }
      if (this.activeArea) {
        this.activeArea.frame = this.outerFrameJQueryNode;
      } else {
        this.outerFrameJQueryNode.on("mouseout", "#" + this.id, function() {
          return _this.cancelRotation();
        });
      }
      return this.outerFrameJQueryNode.mousemove(function(event) {
        var rotationX, rotationY;
        if (!_this.activeArea || _this.activeArea.mouseover(event)) {
          rotationY = (event.pageX - $(window).prop('innerWidth') / 2) / 25;
          rotationX = -1 * (event.pageY - $(window).prop('innerHeight') / 2) / 15;
          debugCode(rotationX, rotationY);
          return TweenLite.set(_this.innerFrameJQueryNode[0], {
            rotationX: _this.fy(rotationX),
            rotationY: _this.fx(rotationY)
          });
        } else {
          return _this.cancelRotation();
        }
      });
    };

    Frame3d.prototype.cancelRotation = function() {
      return TweenLite.to(this.innerFrameJQueryNode[0], 1, {
        rotationX: 0,
        rotationY: 0
      });
    };

    Frame3d.prototype.untrackMouseMovements = function() {
      var _ref, _ref1;
      if ((_ref = this.outerFrameJQueryNode) != null) {
        _ref.off("mousemove");
      }
      return (_ref1 = this.outerFrameJQueryNode) != null ? _ref1.off("mouseout") : void 0;
    };

    Frame3d.prototype.zRefresh = function(node) {
      var firstChild, self, target;
      if (node == null) {
        node = null;
      }
      self = this;
      if (node == null) {
        node = this.innerFrameJQueryNode;
      }
      target = typeof node === 'string' ? $(target, this.innerFrameJQueryNode) : $(node);
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
      var z;
      if (!target) {
        throw new Error("setZOf target argument cannot be null");
      }
      TweenLite.set(target[0], {
        transformStyle: 'preserve-3d',
        overflow: 'visible'
      });
      z = target.attr(this.deepnessAttribute);
      if (z) {
        return TweenLite.to(target[0], transitionDuration, {
          z: z
        });
      }
    };

    Frame3d.prototype.refresh = function() {
      this.untrackMouseMovements();
      this.find3dFrames();
      this.setPerspective();
      this.zRefresh();
      return this.trackMouseMovements();
    };

    Frame3d.prototype.start = function() {
      return this.refresh();
    };

    Frame3d.prototype.init = function(options) {
      var _ref;
      this.deepnessAttribute = options.zAttr || 'data-avalonA-deepness';
      this.cssClass = options["class"] || 'avalona-inner-frame';
      this.fx = typeof options.fx === 'function' ? options.fx : noeffect;
      this.fy = typeof options.fy === 'function' ? options.fy : noeffect;
      if (options.activeArea) {
        this.activeArea = new ActiveArea(options.activeArea);
      }
      return (_ref = this.activeArea) != null ? _ref.debug = this.debug : void 0;
    };

    function Frame3d(id, options) {
      this.id = id;
      if (options == null) {
        options = {};
      }
      this.zRefreshChild = __bind(this.zRefreshChild, this);
      this.debug = options.debug;
      detectTransformStyleSupport();
      if (this.debug === true) {
        console.log("transformStyleIsSupported: " + transformStyleIsSupported);
      }
      if (transformStyleIsSupported) {
        this.init(options);
      } else {
        this.refresh = this.setZOf = this.zRefreshChild = this.zRefresh = this.untrackMouseMovements = this.trackMouseMovements = this.setPerspective = function() {};
      }
    }

    return Frame3d;

  })();

  /* Export
  */


  window.AvalonA = function(id, debug) {
    if (debug == null) {
      debug = false;
    }
    return new Frame3d(id, debug);
  };

}).call(this);
