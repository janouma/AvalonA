
/* AvalonA 0.3.4
*/


(function() {
  var Frame3d;

  Frame3d = (function() {
    var deepnessAttribute;

    deepnessAttribute = 'data-avalonA-deepness';

    Frame3d.prototype.find3dFrames = function() {
      this.outerFrameJQueryNode = $("#" + this.id);
      this.innerFrameJQueryNode = $('.avalona-inner-frame', this.outerFrameJQueryNode).eq(0);
      if (!this.outerFrameJQueryNode.size()) {
        throw new Error("Cannot find 3d frame '#" + this.id + "' in dom");
      }
      if (!this.innerFrameJQueryNode.size()) {
        throw new Error("Cannot find 3d inner frame '#" + this.id + " .avalona-inner-frame' in dom");
      }
    };

    Frame3d.prototype.setUp = function() {
      TweenLite.set(this.innerFrameJQueryNode[0], {
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
        overflow: 'visible !important'
      });
      return $("[" + deepnessAttribute + "]", this.innerFrameJQueryNode).each(function() {
        return TweenLite.set(this, {
          transformStyle: 'preserve-3d'
        });
      });
    };

    Frame3d.prototype.addBehavior = function() {
      var _this = this;
      this.outerFrameJQueryNode.mousemove(function(event) {
        var rotationX, rotationY;
        rotationY = (event.pageX - $(window).prop('innerWidth') / 2) / 25;
        rotationX = -1 * (event.pageY - $(window).prop('innerHeight') / 2) / 15;
        if (_this.debugIsOn) {
          console.log("rotationY: " + rotationY);
        }
        return TweenLite.set(_this.innerFrameJQueryNode[0], {
          rotationX: rotationX,
          rotationY: rotationY
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

    Frame3d.prototype.refreshDeepness = function(target) {
      var targetJqueryNode;
      if (target == null) {
        target = null;
      }
      if (target == null) {
        target = $("[" + deepnessAttribute + "]", this.innerFrameJQueryNode);
      }
      targetJqueryNode = typeof target === 'string' ? $(target, this.innerFrameJQueryNode) : $(target);
      return targetJqueryNode.each(function() {
        var z;
        z = $(this).attr(deepnessAttribute);
        return TweenLite.to(this, .75, {
          z: z
        });
      });
    };

    Frame3d.prototype.refresh = function() {
      this.removeBehavior();
      this.find3dFrames();
      this.setUp();
      this.refreshDeepness();
      return this.addBehavior();
    };

    Frame3d.prototype.start = function() {
      return this.refresh();
    };

    function Frame3d(id, debugIsOn) {
      this.id = id;
      this.debugIsOn = debugIsOn != null ? debugIsOn : false;
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
