### AvalonA 0.6.0 ###

class Frame3d
  transitionDuration = 0.75
  noeffect = (rotation)-> rotation

  debugName = (node)->
    "#{node.prop('tagName')}(#{node.attr('id') or node.attr('class') or node.attr('href')})"

  find3dFrames: ->
    @outerFrameJQueryNode = $("##{@id}")
    @innerFrameJQueryNode = $(".#{@cssClass}", @outerFrameJQueryNode).eq(0)

    if @debug is on
      console.log "@deepnessAttribute: #{@deepnessAttribute}"
      console.log "@cssClass: #{@cssClass}"


    throw new Error "Cannot find 3d frame '##{@id}' in dom" if not @outerFrameJQueryNode.size()
    throw new Error "Cannot find 3d inner frame '##{@id} .#{@cssClass}' in dom" if not @innerFrameJQueryNode.size()


  setUp: ->
    TweenLite.set(
      @innerFrameJQueryNode[0]
      transformPerspective: 1000
    )


  addBehavior: ->
    if @debug is on
      debugCode = (rotationX, rotationY)-> console.log "rotationY: #{rotationY}"
    else
      debugCode = ->

    @outerFrameJQueryNode.mousemove (event)=>
      rotationY = (event.pageX - $(window).prop('innerWidth')/2)/25
      rotationX = -1*(event.pageY - $(window).prop('innerHeight')/2)/15

      debugCode rotationX, rotationY

      TweenLite.set(
         @innerFrameJQueryNode[0]
         rotationX: @fy(rotationX)
         rotationY: @fx(rotationY)
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


  zRefresh: (node = null)->
    self = @
    node ?= @innerFrameJQueryNode
    target = if typeof node is 'string' then $(target, @innerFrameJQueryNode) else $(node)

    console.log "target: #{debugName target}" if @debug is on

    @setZOf target
    firstChild = target.children().eq(0)

    console.log "zRefresh firstChild: #{debugName firstChild}" if @debug is on

    @zRefreshChild(firstChild).siblings().each ->
      self.zRefreshChild $(@)


  zRefreshChild: (child)=>
    throw new Error "zRefreshChild child argument cannot be null" if not child

    if $("[#{@deepnessAttribute}]", child).length
      console.log "zRefresh child #{debugName child} has children" if @debug is on
      @zRefresh child
    else if child.attr @deepnessAttribute
      console.log "zRefresh child #{debugName child} has '#{@deepnessAttribute}'" if @debug is on
      @setZOf child

    child


  setZOf: (target)->
    throw new Error "setZOf target argument cannot be null" if not target

    TweenLite.set(
      target[0]
      transformStyle: 'preserve-3d'
      overflow: 'visible'
    )

    z = target.attr @deepnessAttribute
    if z
      TweenLite.to(
        target[0]
        transitionDuration
        z: z
      )


  refresh: ->
    @removeBehavior()
    @find3dFrames()
    @setUp()
    @zRefresh()
    @addBehavior()


  start: -> @refresh()

  constructor: (@id, options = {})->
    @debug = options.debug
    @deepnessAttribute = options.zAttr or 'data-avalonA-deepness'
    @cssClass = options.class or 'avalona-inner-frame'
    @fx = if typeof options.fx is 'function' then options.fx else noeffect
    @fy = if typeof options.fy is 'function' then options.fy else noeffect




### Export ###

window.AvalonA = (id, debug = false)-> new Frame3d(id, debug)

