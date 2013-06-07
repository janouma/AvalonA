### AvalonA 0.4.0 ###

class Frame3d

  find3dFrames: ->
    @outerFrameJQueryNode = $("##{@id}")
    @deepnessAttribute = @outerFrameJQueryNode.attr('data-avalonA-deepness-attr')
    @deepnessAttribute = if @deepnessAttribute then "data-#{@deepnessAttribute}" else 'data-avalonA-deepness'
    @cssClass = @outerFrameJQueryNode.attr('data-avalonA-class') or 'avalona-inner-frame'
    @innerFrameJQueryNode = $(".#{@cssClass}", @outerFrameJQueryNode).eq(0)

    if @debugIsOn
      console.log "@deepnessAttribute: #{@deepnessAttribute}"
      console.log "@cssClass: #{@cssClass}"


    throw new Error "Cannot find 3d frame '##{@id}' in dom" if not @outerFrameJQueryNode.size()
    throw new Error "Cannot find 3d inner frame '##{@id} .#{@cssClass}' in dom" if not @innerFrameJQueryNode.size()


  setUp: ->
    self = @
    TweenLite.set(
      @innerFrameJQueryNode[0]
      transformPerspective: 1000
      transformStyle: 'preserve-3d'
      overflow: 'visible'
    )

    $("[#{@deepnessAttribute}]", @innerFrameJQueryNode).each ->

      console.log "$(@).attr('id'): #{$(@).attr('id')}" if self.debugIsOn

      TweenLite.set(
        @
        transformStyle: 'preserve-3d'
        overflow: 'visible'
      )


  addBehavior: ->
    if @debugIsOn
      debugCode = (rotationX, rotationY)-> console.log "rotationY: #{rotationY}"
    else
      debugCode = ->

    @outerFrameJQueryNode.mousemove (event)=>
      rotationY = (event.pageX - $(window).prop('innerWidth')/2)/25
      rotationX = -1*(event.pageY - $(window).prop('innerHeight')/2)/15

      debugCode rotationX, rotationY

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
    self = @
    target ?= $("[#{@deepnessAttribute}]", @innerFrameJQueryNode)
    targetJqueryNode = if typeof target is 'string' then $(target, @innerFrameJQueryNode) else $(target)
    targetJqueryNode.each ->
      z = $(@).attr self.deepnessAttribute
      TweenLite.to(
        @
        .75
        z: z
        overflow: 'visible'
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

