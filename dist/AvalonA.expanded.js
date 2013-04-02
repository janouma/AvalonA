
/* AvalonA 0.1.1
*/


(function() {
  var Frame3d;

  Frame3d = (function() {
    var add3d, addBehavior, debugIsOn, id, innerFrameJQueryNode, outerFrameJQueryNode, setUp;

    id = null;

    outerFrameJQueryNode = null;

    innerFrameJQueryNode = null;

    debugIsOn = false;

    setUp = function() {
      TweenLite.set(innerFrameJQueryNode[0], {
        position: 'relative',
        transformPerspective: 1000,
        Z: 0,
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%'
      });
      return $('[data-avalonA-deepness]', innerFrameJQueryNode).each(function() {
        return TweenLite.set(this, {
          transformStyle: 'preserve-3d',
          display: 'block'
        });
      });
    };

    add3d = function() {
      return $('[data-avalonA-deepness]').each(function() {
        var z;
        z = $(this).attr('data-avalonA-deepness');
        return TweenLite.set(this, {
          z: z
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

    function Frame3d(domId, debug) {
      if (debug == null) {
        debug = false;
      }
      debugIsOn = debug;
      id = domId;
      outerFrameJQueryNode = $("#" + id);
      innerFrameJQueryNode = outerFrameJQueryNode.children().eq(0);
      setUp();
      add3d();
      addBehavior();
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
