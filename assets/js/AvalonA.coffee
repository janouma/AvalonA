### AvalonA 0.3.2 ###

class Frame3d

  # Private properties

  id = null
  outerFrameJQueryNode = null
  innerFrameJQueryNode = null
  debugIsOn = false
  deepnessAttribute = 'data-avalonA-deepness'

  find3dFrames =->
    outerFrameJQueryNode = $("##{id}")
    innerFrameJQueryNode = $('.avalona-inner-frame', outerFrameJQueryNode).eq(0)
    throw new Error "Cannot find 3d frame '##{id}' in dom" if not outerFrameJQueryNode.size()
    throw new Error "Cannot find 3d inner frame '##{id} .avalona-inner-frame' in dom" if not innerFrameJQueryNode.size()


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

    $("[#{deepnessAttribute}]", innerFrameJQueryNode).each ->
      TweenLite.set(
        @
        transformStyle: 'preserve-3d'
        display: 'block'
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

  removeBehavior =->
    outerFrameJQueryNode?.off "mousemove"
    outerFrameJQueryNode?.off "mouseout"

  refreshDeepness = (target)->
    target ?= $("[#{deepnessAttribute}]", innerFrameJQueryNode)
    targetJqueryNode = if typeof target is 'string' then $(target, innerFrameJQueryNode) else $(target)
    targetJqueryNode.each ->
      z = $(@).attr deepnessAttribute
      TweenLite.to(
        @
        .75
        z: z
      )

  refresh =->
    removeBehavior()
    find3dFrames()
    setUp()
    refreshDeepness()
    addBehavior()


  # Public properties

  start: -> refresh()

  refreshDeepness: (target = null)-> refreshDeepness target

  refresh: -> refresh()

  constructor: (domId, debug = false)->
    debugIsOn = debug
    id = domId



window.AvalonA = (id, debug = false)-> new Frame3d(id, debug)

