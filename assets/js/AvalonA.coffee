### AvalonA 0.1 ###

class Frame3d
  id = null
  jQFrame3d = null
  frame3d = null
  jQMouseEventLayer = null
  mouseEventLayer = null
  debugIsOn = false


  setUp =->
    TweenLite.set(
      frame3d
      position: 'relative'
      transformPerspective: 1000
      Z: 0
      transformStyle: 'preserve-3d'
    )

    $('[data-avalonA-deepness]', frame3d).css(pointerEvents: 'none').each ->
      TweenLite.set(
        this
        transformStyle: 'preserve-3d'
      )

    mouseEventLayerClass = 'avalonA-mouseEventLayer'
    jQFrame3d.prepend "<div class='#{mouseEventLayerClass}'></div>"
    jQMouseEventLayer = $(".#{mouseEventLayerClass}", jQFrame3d)
    jQMouseEventLayer.css(
      position: 'absolute'
      top: 0
      left: 0
      width: '100%'
      height: '100%'
    )

    if debugIsOn
      jQMouseEventLayer.css(
        borderStyle: 'dashed'
        borderWidth: 1
        borderColor: 'blue'
        backgroundColor: 'lightblue'
        opacity: .2
      )

    mouseEventLayer = jQMouseEventLayer[0]
    TweenLite.set(
      mouseEventLayer
      z: 100
    )


  add3d =->
    $('[data-avalonA-deepness]').each ->
      z = $(this).attr 'data-avalonA-deepness'
      TweenLite.set(
        this
        z: z
      )


  addBehavior =->
    jQFrame3d.mousemove (event)->
      rotationY = (event.pageX - $(window).prop('innerWidth')/2)/25
      rotationX = -1*(event.pageY - $(window).prop('innerHeight')/2)/15

      console.log "rotationY: #{rotationY}" if debugIsOn

      TweenLite.set(
        this
        rotationX: rotationX
        rotationY: rotationY
      )

    jQFrame3d.mouseout ->
      TweenLite.to(
        this
        1
        rotationX: 0
        rotationY: 0
      )


  constructor: (domId, debug = false)->
    debugIsOn = debug
    id = domId
    jQFrame3d = $("##{id}")
    frame3d = jQFrame3d[0]
    setUp()
    add3d()
    addBehavior()



window.AvalonA = (id, debug = false)->
  new Frame3d(id, debug)

