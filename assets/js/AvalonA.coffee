### AvalonA 0.3.4 ###

class Frame3d

  deepnessAttribute = 'data-avalonA-deepness'

  find3dFrames: ->
    @outerFrameJQueryNode = $("##{@id}")
    @innerFrameJQueryNode = $('.avalona-inner-frame', @outerFrameJQueryNode).eq(0)
    throw new Error "Cannot find 3d frame '##{@id}' in dom" if not @outerFrameJQueryNode.size()
    throw new Error "Cannot find 3d inner frame '##{@id} .avalona-inner-frame' in dom" if not @innerFrameJQueryNode.size()


  setUp: ->
    TweenLite.set(
      @innerFrameJQueryNode[0]
      transformPerspective: 1000
      transformStyle: 'preserve-3d'
      overflow: 'visible !important'
    )

    $("[#{deepnessAttribute}]", @innerFrameJQueryNode).each ->
      TweenLite.set(
        @
        transformStyle: 'preserve-3d'
      )


  addBehavior: ->
    @outerFrameJQueryNode.mousemove (event)=>
      rotationY = (event.pageX - $(window).prop('innerWidth')/2)/25
      rotationX = -1*(event.pageY - $(window).prop('innerHeight')/2)/15

      console.log "rotationY: #{rotationY}" if @debugIsOn

      TweenLite.set(
         @innerFrameJQueryNode[0]
         rotationX: rotationX
         rotationY: rotationY
       )

    @outerFrameJQueryNode.on "mouseout", "##{@id}", =>
      TweenLite.to(
        @innerFrameJQueryNode[0]
        1
        rotationX: 0
        rotationY: 0
      )


  removeBehavior: ->
    @outerFrameJQueryNode?.off "mousemove"
    @outerFrameJQueryNode?.off "mouseout"


  refreshDeepness: (target = null)->
    target ?= $("[#{deepnessAttribute}]", @innerFrameJQueryNode)
    targetJqueryNode = if typeof target is 'string' then $(target, @innerFrameJQueryNode) else $(target)
    targetJqueryNode.each ->
      z = $(@).attr deepnessAttribute
      TweenLite.to(
        @
        .75
        z: z
      )


  refresh: ->
    @removeBehavior()
    @find3dFrames()
    @setUp()
    @refreshDeepness()
    @addBehavior()


  start: -> @refresh()

  constructor: (@id, @debugIsOn = false)->



### Export ###

window.AvalonA = (id, debug = false)-> new Frame3d(id, debug)

