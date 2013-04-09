### AvalonA 0.3.0 ###

class Frame3d
  id = null
  outerFrameJQueryNode = null
  innerFramesJQueryNodes = null
  debugIsOn = false


  setUp =->
    innerFramesJQueryNodes.each ->
      TweenLite.set(
        this
        position: 'relative'
        transformPerspective: 1000
        Z: 0
        transformStyle: 'preserve-3d'
      )

      $('[data-avalonA-deepness]', this).each ->
        TweenLite.set(
          this
          transformStyle: 'preserve-3d'
          display: 'block'
        )


  add3d =->
    $('[data-avalonA-deepness]').each ->
      z = $(this).attr 'data-avalonA-deepness'
      TweenLite.set(
        this
        z: z
      )


  addBehavior =->
    outerFrameJQueryNode.mousemove (event)->
      rotationY = (event.pageX - $(window).prop('innerWidth')/2)/25
      rotationX = -1*(event.pageY - $(window).prop('innerHeight')/2)/15

      console.log "rotationY: #{rotationY}" if debugIsOn

      innerFramesJQueryNodes.each ->
        TweenLite.set(
           this
           rotationX: rotationX
           rotationY: rotationY
         )

    outerFrameJQueryNode.mouseout ->
      innerFramesJQueryNodes.each ->
        TweenLite.to(
          this
          1
          rotationX: 0
          rotationY: 0
        )



  constructor: (domId, debug = false)->
    debugIsOn = debug
    id = domId
    outerFrameJQueryNode = $("##{id}")
    innerFramesJQueryNodes = outerFrameJQueryNode.children(':not(.avalona-inner-frame) .avalona-inner-frame')
    setUp()
    add3d()
    addBehavior()



window.AvalonA = (id, debug = false)->
  new Frame3d(id, debug)

