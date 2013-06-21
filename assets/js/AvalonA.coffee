### AvalonA 0.6.1 ###

class ActiveArea
  dimensionPattern = /^\d+(%|px)?$/gi

  validDimension = (dimension)->
    dimensionPattern.lastIndex = 0
    result = dimensionPattern.test dimension
    dimensionPattern.lastIndex = 0
    result
    

  assertValid: ->
    errors = ['The following validation errors occured:']

    if typeof @position isnt 'object'
      errors.push "area.position is not valid (#{@position})" if @position isnt 'auto'
    else
      errors.push "area.position.x is not valid (#{@position.x}})" if @position.x isnt 'auto' and not validDimension @position.x
      errors.push "area.position.y is not valid (#{@position.y}})" if @position.y isnt 'auto' and not validDimension @position.y

    errors.push "area.attachment is not valid (#{@attachment})" if @attachment not in ['fixed', 'scroll']
    errors.push "area.width is not valid (#{@area.width})" if not validDimension @area.width
    errors.push "area.height is not valid (#{@area.height})" if not validDimension @area.height

    throw new Error errors.join("\n") if errors.length > 1


  processActiveArea: ->
    @width = parseInt(@area.width, 10)
    @widthIsFluid = dimensionPattern.exec(@area.width)[1] is '%'
    dimensionPattern.lastIndex = 0

    @height = parseInt(@area.height, 10)
    @heightIsFluid = dimensionPattern.exec(@area.height)[1] is '%'
    dimensionPattern.lastIndex = 0

    if typeof @position is 'object'
      @x = parseInt(@position.x, 10) if @position.x isnt 'auto'
      @y = parseInt(@position.y, 10) if @position.y isnt 'auto'


  init: (@frame)->
    throw new Error "frame argument cannot be null" if not @frame

    @xBase = (xBaseComputation = @getXBaseComputation())()
    @yBase = (yBaseComputation = @getYBaseComputation())()

    if @widthIsFluid
      @xMaxComputation = -> @xMin + (@width/100) * @frame.width()
    else
      @xMaxComputation = -> @xMin + @width

    if @heightIsFluid
      @yMaxComputation = -> @yMin + (@height/100) * @frame.height()
    else
      @yMaxComputation = -> @yMin + @height

    if @attachment is 'fixed'
      @xPadding = @frame.prop('scrollLeft')
      @yPadding = @frame.prop('scrollTop')

      if @debug is on
        console.log "Listen to scroll event"
        self = @
        scrollDebugCode = -> console.log "Scroll : @xPadding = #{self.xPadding}, @yPadding = #{self.yPadding}"
      else
        scrollDebugCode = ->

      $(window).scroll =>
        @xPadding = @frame.prop('scrollLeft')
        @yPadding = @frame.prop('scrollTop')
        @refreshBounds()
        scrollDebugCode()
    else
      @xPadding = @yPadding = 0

    if @debug is on
      self = @
      resizeDebugCode = -> console.log "Resize : @frame.width() = #{self.frame.width()}, @frame.height() = #{self.frame.height()}"
    else
      resizeDebugCode = ->

    $(window).resize =>
      @xBase = xBaseComputation()
      @yBase = yBaseComputation()
      @refreshBounds()
      resizeDebugCode()

    @refreshBounds()


  refreshBounds: ->
    @xMin = @xBase + @xPadding
    @xMax = @xMaxComputation()
    @yMin = @yBase + @yPadding
    @yMax = @yMaxComputation()


  bounds: ->
    xMin: @xMin
    xMax: @xMax
    yMin: @yMin
    yMax: @yMax


  getXBaseComputation: ->
    if @position.x and @position.x isnt 'auto'
      if dimensionPattern.exec(@position.x)[1] is '%'
        xBaseComputation = => (@x/100) * @frame.width()
      else
        xBaseComputation = => @x

      dimensionPattern.lastIndex = 0
    else
      if @widthIsFluid
        xBaseComputation = => ((50 - @width/2)/100) * @frame.width()
      else
        xBaseComputation = => @frame.width()/2 - @width/2

    xBaseComputation


  getYBaseComputation: ->
    if @position.y and @position.y isnt 'auto'
      if dimensionPattern.exec(@position.y)[1] is '%'
        yBaseComputation = => (@y/100) * @frame.height()
      else
        yBaseComputation = => @y

      dimensionPattern.lastIndex = 0
    else
      if @heightIsFluid
        yBaseComputation = => ((50 - @height/2)/100) * @frame.height()
      else
        yBaseComputation = => @frame.height()/2 - @height/2

    yBaseComputation


  mouseover: (event)-> @xMin <= event.pageX <= @xMax and @yMin <= event.pageY <= @yMax


  constructor: (@area)->
    throw new Error "area argument is missing" if not @area
    @position = @area.position or 'auto'

    if typeof @position is 'object'
      @position.x ?= 'auto'
      @position.y ?= 'auto'
      @position = 'auto' if @position.x is 'auto' and @position.y is 'auto'

    @attachment = @area.attachment or 'fixed'
    @assertValid()
    @processActiveArea()


#================================================================================================
class Frame3d
  transitionDuration = 0.75
  noeffect = (rotation)-> rotation
  transformStyleIsSupported = null

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
      $('body').append "<div id='avalona-active-area' style='background-color:hotpink;opacity:0.75;pointer-events:none;position:absolute;visibility:hidden;z-index:10000;'>AvalonA Active Area</div>"

      activeAreaPlaceholder = $('#avalona-active-area')
      self = @

      debugCode = (rotationX, rotationY)->
        console.log "rotationX: #{rotationX}, rotationY: #{rotationY}"

        bounds = self.activeArea.bounds()
        activeAreaPlaceholder.css(
          visibility: 'visible'
          left: "#{bounds.xMin}px"
          top: "#{bounds.yMin}px"
          width: "#{bounds.xMax - bounds.xMin}px"
          height: "#{bounds.yMax - bounds.yMin}px"
        )
    else
      debugCode = ->

    if @activeArea
      @activeArea.init @outerFrameJQueryNode
    else
      @outerFrameJQueryNode.on "mouseout", "##{@id}", =>
        @cancelRotation()

    mouseMoveCount = 0
    @outerFrameJQueryNode.mousemove (event)=>
      return if ++mouseMoveCount % 5 > 0

      if not @activeArea or @activeArea.mouseover(event)
        rotationY = (event.pageX - $(window).prop('innerWidth')/2)/25
        rotationX = -1*(event.pageY - $(window).prop('innerHeight')/2)/15

        debugCode rotationX, rotationY

        TweenLite.to(
          @innerFrameJQueryNode[0]
          0.1
          rotationX: @fy(rotationX)
          rotationY: @fx(rotationY)
        )
      else
        @cancelRotation()


  cancelRotation: ->
    TweenLite.to(
      @innerFrameJQueryNode[0]
      1
      rotationX: 0
      rotationY: 0
    )


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
    @activeArea = new ActiveArea(options.activeArea) if options.activeArea
    @activeArea?.debug = @debug


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

