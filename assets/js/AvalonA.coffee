### AvalonA 0.6.0 ###

class Frame3d
  transitionDuration = 0.75
  noeffect = (rotation)-> rotation
  transformStyleIsSupported = null
  dimensionPattern = /^\d+(%|px)?$/gi

  detectTransformStyleSupport = ->
    if transformStyleIsSupported is null
      id = 'avalona-detection-element'
      body = $('body').prepend "<b id='#{id}' style='position:absolute; top:0; left:0;'></b>"
      element = $ "##{id}"

      element[0].style?.webkitTransformStyle = 'preserve-3d'
      element[0].style?.MozTransformStyle = 'preserve-3d'
      element[0].style?.msTransformStyle = 'preserve-3d'
      element[0].style?.transformStyle = 'preserve-3d'

      computedStyle = getComputedStyle(element[0], null)
      style = computedStyle.getPropertyValue('-webkit-transform-style') or computedStyle.getPropertyValue('-moz-transform-style') or computedStyle.getPropertyValue('-ms-transform-style') or computedStyle.getPropertyValue('transform-style')

      transformStyleIsSupported = style is 'preserve-3d'
      element.remove()

    transformStyleIsSupported



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


  setPerspective: ->
    TweenLite.set(
      @innerFrameJQueryNode[0]
      transformPerspective: 1000
    )


  trackMouseMovements: ->
    if @debug is on
      @outerFrameJQueryNode.prepend "<div id='avalona-active-area' style='background-color:hotpink;opacity:0.5;pointer-events:none;position:absolute;visibility:hidden;'>AvalonA Active Area</div>"
      debugCode = (rotationX, rotationY)-> console.log "rotationX: #{rotationX}, rotationY: #{rotationY}"
    else
      debugCode = ->

    @outerFrameJQueryNode.mousemove (event)=>
      if not @activeArea or @mouseIsOnActiveArea(event)
        rotationY = (event.pageX - $(window).prop('innerWidth')/2)/25
        rotationX = -1*(event.pageY - $(window).prop('innerHeight')/2)/15

        debugCode rotationX, rotationY

        TweenLite.set(
          @innerFrameJQueryNode[0]
          rotationX: @fy(rotationX)
          rotationY: @fx(rotationY)
        )
      else
        @cancelRotation()

    if not @activeArea
      @outerFrameJQueryNode.on "mouseout", "##{@id}", =>
        @cancelRotation()


  mouseIsOnActiveArea: (event)->
    bounds = @computeActiveAreaBounds()

    if @debug is on
      $('#avalona-active-area').css(
        visibility: 'visible'
        left: "#{bounds.xMin}px"
        top: "#{bounds.yMin}px"
        width: "#{bounds.xMax - bounds.xMin}px"
        height: "#{bounds.yMax - bounds.yMin}px"
      )


    bounds.xMin <= event.pageX <= bounds.xMax and bounds.yMin <= event.pageY <= bounds.yMax


  cancelRotation: ->
    TweenLite.to(
      @innerFrameJQueryNode[0]
      1
      rotationX: 0
      rotationY: 0
    )

  computeActiveAreaBounds: ->
    outerFrameWidth = @outerFrameJQueryNode.width()
    outerFrameHeight = @outerFrameJQueryNode.height()

    if typeof @activeArea.position isnt 'object'
      xMin = (if @activeArea.width.isFluid then ((50 - @activeArea.width.value / 2)/100) * outerFrameWidth else outerFrameWidth/2 - @activeArea.width.value / 2)

      yMin = (if @activeArea.height.isFluid then ((50 - @activeArea.height.value / 2)/100) * outerFrameHeight else outerFrameHeight/2 - @activeArea.height.value / 2)
    else
      xMin = if @activeArea.position.x.isFluid then (@activeArea.position.x.value/100) * outerFrameWidth else @activeArea.position.x.value
      yMin = if @activeArea.position.y.isFluid then (@activeArea.position.y.value/100) * outerFrameHeight else @activeArea.position.y.value

    xMin += @outerFrameJQueryNode.prop('scrollLeft') if @activeArea.attachment is 'fixed'
    yMin += @outerFrameJQueryNode.prop('scrollTop') if @activeArea.attachment is 'fixed'
    
    xMin: xMin
    xMax: xMin + (if @activeArea.width.isFluid then (@activeArea.width.value/100) * outerFrameWidth else @activeArea.height.value)
    yMin: yMin
    yMax: yMin + (if @activeArea.height.isFluid then (@activeArea.height.value/100) * outerFrameHeight else @activeArea.height.value)


  untrackMouseMovements: ->
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
    @untrackMouseMovements()
    @find3dFrames()
    @setPerspective()
    @zRefresh()
    @trackMouseMovements()


  start: -> @refresh()

  init: (options)->
    @deepnessAttribute = options.zAttr or 'data-avalonA-deepness'
    @cssClass = options.class or 'avalona-inner-frame'
    @fx = if typeof options.fx is 'function' then options.fx else noeffect
    @fy = if typeof options.fy is 'function' then options.fy else noeffect
    @activeArea = options.activeArea

    if @activeArea
      @activeArea.position ?= 'auto'
      @activeArea.attachment ?= 'fixed'
      @assertActiveAreaIsValid()
      @processActiveArea()


  assertActiveAreaIsValid: ->
    errors = ['The following validation errors occured:']

    if typeof @activeArea.position isnt 'object'
      errors.push "activeArea.position is not valid (#{@activeArea.position})" if @activeArea.position isnt 'auto'
    else
      errors.push "activeArea.position.x is not valid (#{@activeArea.position.x}})" if not dimensionPattern.test @activeArea.position.x
      dimensionPattern.lastIndex = 0
      errors.push "activeArea.position.y is not valid (#{@activeArea.position.y}})" if not dimensionPattern.test @activeArea.position.y
      dimensionPattern.lastIndex = 0

    errors.push "activeArea.attachment is not valid (#{@activeArea.attachment})" if @activeArea.attachment not in ['fixed', 'scroll']
    errors.push "activeArea.width is not valid (#{@activeArea.width})" if not dimensionPattern.test @activeArea.width
    dimensionPattern.lastIndex = 0
    errors.push "activeArea.height is not valid (#{@activeArea.height})" if not dimensionPattern.test @activeArea.height
    dimensionPattern.lastIndex = 0

    throw new Error errors.join("\n") if errors.length > 1


  processActiveArea: ->
    if typeof @activeArea.position is 'object'
      @activeArea.position.x =
        value: parseInt(@activeArea.position.x, 10)
        isFluid: dimensionPattern.exec(@activeArea.position.x)[1] is '%'

      dimensionPattern.lastIndex = 0

      @activeArea.position.y =
        value: parseInt(@activeArea.position.y, 10)
        isFluid: dimensionPattern.exec(@activeArea.position.y)[1] is '%'

      dimensionPattern.lastIndex = 0

    @activeArea.width =
      value: parseInt(@activeArea.width, 10)
      isFluid: dimensionPattern.exec(@activeArea.width)[1] is '%'

    dimensionPattern.lastIndex = 0

    @activeArea.height =
      value: parseInt(@activeArea.height, 10)
      isFluid: dimensionPattern.exec(@activeArea.height)[1] is '%'

    dimensionPattern.lastIndex = 0

    if @debug is on
      console.log "activeArea.width (#{@activeArea.width.value}) is #{if not @activeArea.width.isFluid then 'not ' else ''}fluid"
      console.log "activeArea.height (#{@activeArea.height.value}) is #{if not @activeArea.height.isFluid then 'not ' else ''}fluid"


  constructor: (@id, options = {})->
    @debug = options.debug
    detectTransformStyleSupport()
    console.log "transformStyleIsSupported: #{transformStyleIsSupported}" if @debug is on

    if transformStyleIsSupported
      @init options
    else
      @refresh = @setZOf = @zRefreshChild = @zRefresh = @untrackMouseMovements = @trackMouseMovements = @setPerspective = ->




### Export ###

window.AvalonA = (id, debug = false)-> new Frame3d(id, debug)

