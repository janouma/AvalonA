
/* AvalonA 0.3.1
*/


(function() {
  var Frame3d;

  Frame3d = (function() {
    var addBehavior, debugIsOn, deepnessAttribute, find3dFrames, id, innerFrameJQueryNode, outerFrameJQueryNode, refresh, refreshDeepness, removeBehavior, setUp;

    id = null;

    outerFrameJQueryNode = null;

    innerFrameJQueryNode = null;

    debugIsOn = false;

    deepnessAttribute = 'data-avalonA-deepness';

    find3dFrames = function() {
      outerFrameJQueryNode = $("#" + id);
      innerFrameJQueryNode = $('.avalona-inner-frame:nth-child(1)', outerFrameJQueryNode);
      if (!outerFrameJQueryNode.size()) {
        throw new Error("Cannot find 3d frame '#" + id + "' in dom");
      }
      if (!innerFrameJQueryNode.size()) {
        throw new Error("Cannot find 3d inner frame '#" + id + " .avalona-inner-frame' in dom");
      }
    };

    setUp = function() {
      TweenLite.set(innerFrameJQueryNode[0], {
        position: 'relative',
        transformPerspective: 1000,
        Z: 0,
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%'
      });
      return $("[" + deepnessAttribute + "]", innerFrameJQueryNode).each(function() {
        return TweenLite.set(this, {
          transformStyle: 'preserve-3d',
          display: 'block'
        });
      });
    };

    addBehavior = function() {
      outerFrameJQueryNode.mousemove(function(event) {
        var rotationX, rotationY;
        rotationY = (event.pageX - $(window).prop('innerWidth') / 2) / 25;
        rotationX = -1 * (event.pageY - $(window).prop('innerHeight') / 2) / 15;
        if (debugIsOn) {
          console.log("rotationY: " + rotationY);
        }
        return TweenLite.set(innerFrameJQueryNode[0], {
          rotationX: rotationX,
          rotationY: rotationY
        });
      });
      return outerFrameJQueryNode.mouseout(function() {
        return TweenLite.to(innerFrameJQueryNode[0], 1, {
          rotationX: 0,
          rotationY: 0
        });
      });
    };

    removeBehavior = function() {
      if (outerFrameJQueryNode != null) {
        outerFrameJQueryNode.off("mousemove");
      }
      return outerFrameJQueryNode != null ? outerFrameJQueryNode.off("mouseout") : void 0;
    };

    refreshDeepness = function(target) {
      var targetJqueryNode;
      if (target == null) {
        target = $("[" + deepnessAttribute + "]", innerFrameJQueryNode);
      }
      targetJqueryNode = typeof target === 'string' ? $(target, innerFrameJQueryNode) : $(target);
      return targetJqueryNode.each(function() {
        var z;
        z = $(this).attr(deepnessAttribute);
        return TweenLite.to(this, .75, {
          z: z
        });
      });
    };

    refresh = function() {
      removeBehavior();
      find3dFrames();
      setUp();
      refreshDeepness();
      return addBehavior();
    };

    Frame3d.prototype.start = function() {
      return refresh();
    };

    Frame3d.prototype.refreshDeepness = function(target) {
      if (target == null) {
        target = null;
      }
      return refreshDeepness(target);
    };

    Frame3d.prototype.refresh = function() {
      return refresh();
    };

    function Frame3d(domId, debug) {
      if (debug == null) {
        debug = false;
      }
      debugIsOn = debug;
      id = domId;
    }

    return Frame3d;

  })();

  window.AvalonA = function(id, debug) {
    if (debug == null) {
      debug = false;
    }
    return new Frame3d(id, debug);
  };

}).call(this);
