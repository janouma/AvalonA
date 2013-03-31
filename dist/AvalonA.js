
/* AvalonA 0.1
*/


(function() {
  var Frame3d;

  Frame3d = (function() {
    var add3d, addBehavior, debugIsOn, frame3d, id, jQFrame3d, jQMouseEventLayer, mouseEventLayer, setUp;

    id = null;

    jQFrame3d = null;

    frame3d = null;

    jQMouseEventLayer = null;

    mouseEventLayer = null;

    debugIsOn = false;

    setUp = function() {
      var mouseEventLayerClass;
      TweenLite.set(frame3d, {
        position: 'relative',
        transformPerspective: 1000,
        Z: 0,
        transformStyle: 'preserve-3d'
      });
      $('[data-avalonA-deepness]', frame3d).css({
        pointerEvents: 'none'
      }).each(function() {
        return TweenLite.set(this, {
          transformStyle: 'preserve-3d'
        });
      });
      mouseEventLayerClass = 'avalonA-mouseEventLayer';
      jQFrame3d.prepend("<div class='" + mouseEventLayerClass + "'></div>");
      jQMouseEventLayer = $("." + mouseEventLayerClass, jQFrame3d);
      jQMouseEventLayer.css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      });
      if (debugIsOn) {
        jQMouseEventLayer.css({
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: 'blue',
          backgroundColor: 'lightblue',
          opacity: .2
        });
      }
      mouseEventLayer = jQMouseEventLayer[0];
      return TweenLite.set(mouseEventLayer, {
        z: 100
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
      jQFrame3d.mousemove(function(event) {
        var rotationX, rotationY;
        rotationY = (event.pageX - $(window).prop('innerWidth') / 2) / 25;
        rotationX = -1 * (event.pageY - $(window).prop('innerHeight') / 2) / 15;
        if (debugIsOn) {
          console.log("rotationY: " + rotationY);
        }
        return TweenLite.set(this, {
          rotationX: rotationX,
          rotationY: rotationY
        });
      });
      return jQFrame3d.mouseout(function() {
        return TweenLite.to(this, 1, {
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
      jQFrame3d = $("#" + id);
      frame3d = jQFrame3d[0];
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
