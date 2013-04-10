### AvalonA 0.3.1 ###

class Frame3d

  # Private properties

  id = null
  outerFrameJQueryNode = null
  innerFrameJQueryNode = null
  debugIsOn = false
  deepnessAttribute = 'data-avalonA-deepness'


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
        this
        transformStyle: 'preserve-3d'
        display: 'block'
      )


  add3d =->
    $('[data-avalonA-deepness]').each ->
      z = $(this).attr deepnessAttribute
      TweenLite.to(
        this
        .75
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

  refresh = (target)->
    targetJqueryNode = if typeof target is 'string' then $(target, innerFrameJQueryNode) else $(target)
    targetJqueryNode.each ->
      z = $(this).attr deepnessAttribute
      TweenLite.to(
        this
        .75
        z: z
      )

  # Public properties

  refresh: (target = null)->
    if not target
      console.log "Refreshing all '#{deepnessAttribute}" if debugIsOn
      refresh $("[#{deepnessAttribute}]", innerFrameJQueryNode)
    else
      console.log "Refreshing only one '#{deepnessAttribute}'" if debugIsOn
      refresh target


  constructor: (domId, debug = false)->
    debugIsOn = debug
    id = domId
    outerFrameJQueryNode = $("##{id}")
    innerFrameJQueryNode = $('.avalona-inner-frame:nth-child(1)', outerFrameJQueryNode)
    setUp()
    add3d()
    addBehavior()



window.AvalonA = (id, debug = false)-> new Frame3d(id, debug)

