### AvalonA 0.2.0 ###

class Frame3d
  id = null
  outerFrameJQueryNode = null
  innerFrameJQueryNode = null
  debugIsOn = false


  setUp =->
    TweenLite.set(
      innerFrameJQueryNode[0]
      position: 'relative'
      transformPerspective: 1000
      Z: 0
      transformStyle: 'preserve-3d'
      width: '100%'
      height: '100%'
    )

    $('[data-avalonA-deepness]', innerFrameJQueryNode).each ->
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

      TweenLite.set(
         innerFrameJQueryNode[0]
         rotationX: rotationX
         rotationY: rotationY
       )

    outerFrameJQueryNode.mouseout ->
      TweenLite.to(
        innerFrameJQueryNode[0]
        1
        rotationX: 0
        rotationY: 0
      )



  constructor: (domId, debug = false)->
    debugIsOn = debug
    id = domId
    outerFrameJQueryNode = $("##{id}")
    innerFrameJQueryNode = outerFrameJQueryNode.children('.avalona-inner-frame').eq(0)
    setUp()
    add3d()
    addBehavior()



window.AvalonA = (id, debug = false)->
  new Frame3d(id, debug)

