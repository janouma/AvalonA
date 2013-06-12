
/* AvalonA 0.6.0
*/


(function() {
  var Frame3d,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Frame3d = (function() {
    var debugName, noeffect, transitionDuration;

    transitionDuration = 0.75;

    noeffect = function(rotation) {
      return rotation;
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

    Frame3d.prototype.setUp = function() {
      return TweenLite.set(this.innerFrameJQueryNode[0], {
        transformPerspective: 1000
      });
    };

    Frame3d.prototype.addBehavior = function() {
      var debugCode,
        _this = this;
      if (this.debug === true) {
        debugCode = function(rotationX, rotationY) {
          return console.log("rotationY: " + rotationY);
        };
      } else {
        debugCode = function() {};
      }
      this.outerFrameJQueryNode.mousemove(function(event) {
        var rotationX, rotationY;
        rotationY = (event.pageX - $(window).prop('innerWidth') / 2) / 25;
        rotationX = -1 * (event.pageY - $(window).prop('innerHeight') / 2) / 15;
        debugCode(rotationX, rotationY);
        return TweenLite.set(_this.innerFrameJQueryNode[0], {
          rotationX: _this.fy(rotationX),
          rotationY: _this.fx(rotationY)
        });
      });
      return this.outerFrameJQueryNode.on("mouseout", "#" + this.id, function() {
        return TweenLite.to(_this.innerFrameJQueryNode[0], 1, {
          rotationX: 0,
          rotationY: 0
        });
      });
    };

    Frame3d.prototype.removeBehavior = function() {
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
      this.removeBehavior();
      this.find3dFrames();
      this.setUp();
      this.zRefresh();
      return this.addBehavior();
    };

    Frame3d.prototype.start = function() {
      return this.refresh();
    };

    function Frame3d(id, options) {
      this.id = id;
      if (options == null) {
        options = {};
      }
      this.zRefreshChild = __bind(this.zRefreshChild, this);
      this.debug = options.debug;
      this.deepnessAttribute = options.zAttr || 'data-avalonA-deepness';
      this.cssClass = options["class"] || 'avalona-inner-frame';
      this.fx = typeof options.fx === 'function' ? options.fx : noeffect;
      this.fy = typeof options.fy === 'function' ? options.fy : noeffect;
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
