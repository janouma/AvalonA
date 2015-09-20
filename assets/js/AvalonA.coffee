# @codekit-prepend 'utils/DomUtil'
# @codekit-prepend 'ActiveArea'
# @codekit-prepend 'Signal'
# @codekit-prepend 'Layer'
# @codekit-prepend 'Transformer'
#================================================================================================

### AvalonA 1.2.0 ###
console.log '%cAvalonA 1.2.0', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;'

_TweenLite = undefined

defineAvalonA = ->
	class Frame3d
		noeffect = (rotation)-> rotation
		transformStyleIsSupported = undefined

		detectTransformStyleSupport = ->
			if transformStyleIsSupported is undefined
				element = document.createElement 'b'
				element.id = 'avalona-detection-element'
				element.style.position = 'absolute'
				element.style.top = 0
				element.style.left = 0

				document.body.appendChild element

				element.style.webkitTransformStyle = 'preserve-3d'
				element.style.MozTransformStyle = 'preserve-3d'
				element.style.msTransformStyle = 'preserve-3d'
				element.style.transformStyle = 'preserve-3d'

				transformStyleIsSupported = DomUtil.getTransformStyle(getComputedStyle(element)) is 'preserve-3d'
				document.body.removeChild(element)

			transformStyleIsSupported


		find3dFrames: ->
			@frame = document.getElementById @frameId
			@transformedLayer = @frame.querySelector "##{@layerId}"

			if @debug is on
				console.log "@transformAttribute: #{@transformAttribute}"
				console.log "@layerId: #{@layerId}"

			throw new Error "Cannot find 3d frame '##{@frameId}' in dom" if not @frame
			throw new Error "Cannot find 3d inner frame '##{@frameId} > ##{@layerId}' in dom" if not @transformedLayer


		addPerspective: ->
			_TweenLite.set(
				@transformedLayer
				css: perspective: 1000
			)


		removePerspective: ->
			_TweenLite.set(
				@transformedLayer
				css: perspective: 'none'
			)


		trackMouseMovements: ->
			if @debug is on and @activeArea
				activeAreaPlaceholderId = 'avalona-active-area'
				activeAreaPlaceholder = document.getElementById(activeAreaPlaceholderId) or document.createElement('div')
				activeAreaPlaceholder.textContent = 'AvalonA Active Area'
				activeAreaPlaceholder.id = activeAreaPlaceholderId

				activeAreaPlaceholder.style.setProperty(rule, value) for rule, value of {
					'background-color': 'hotpink'
					'opacity': 0.5
					'pointer-events': 'none'
					'position': 'absolute'
					'visibility': 'hidden'
					'z-index': 10000
				}

				document.body.appendChild activeAreaPlaceholder

				@debugMouseMove = ->
					console.log "rotationX: #{@rotationX}, rotationY: #{@rotationY}"

					bounds = @activeArea.bounds()
					activeAreaPlaceholder.style.setProperty(rule, value) for rule, value of {
						visibility: 'visible'
						left: "#{bounds.xMin}px"
						top: "#{bounds.yMin}px"
						width: "#{bounds.xMax - bounds.xMin}px"
						height: "#{bounds.yMax - bounds.yMin}px"
					}
			else
				@debugMouseMove = ->

			if @activeArea
				@activeArea.init @frame
			else
				@frame.addEventListener(
					'mouseleave'
					(e) -> @mouseout() if e.target.id is @frameId
					no
				)


			@frame.addEventListener 'mousemove', @mousemove, no


		mouseout: => @disableRotation()

		mouseMoveCount: 0

		mousemove: (event)=>
			return if ++@mouseMoveCount % 5 > 0
			if not @activeArea or @activeArea.mouseover(event)
				@onrotation()
				@rotationY = (event.pageX - window.innerWidth / 2) / 25
				@rotationX = -1 * (event.pageY - window.innerHeight / 2) / 15

				@debugMouseMove()

				_TweenLite.to(
					@transformedLayer
					0.1
					css:
						rotationX: @fy(@rotationX)
						rotationY: @fx(@rotationY)
				)
			else @disableRotation()


		onrotation: ->
			clearTimeout @rotationTimeoutId

			unless @rotating
				@animation?.pause()
				@onstartrotation?()
				@rotating = on

			@rotationTimeoutId = setTimeout(
				@stopRotation
				@idleTimeout
			) if @idleTimeout > 0


		stopRotation: =>
			clearTimeout @rotationTimeoutId
			if @rotating
				@rotating = off
				@onendrotation?()
				@animation?.play()


		disableRotation: (duration = 1)->
			@resetRotation(duration) if (@rotationX or @rotationY) and not @animation?
			@stopRotation()


		resetRotation: (duration = 1)->
			clearTimeout @rotationTimeoutId
			@rotationX = @rotationY = 0
			_TweenLite.to(
				@transformedLayer
				duration
				css:
					rotationX: 0
					rotationY: 0
			)

		resetTransform: ->
			clearTimeout @rotationTimeoutId
			@rotationX = @rotationY = 0
			@transformedLayer.style.setProperty(rule, value) for rule, value of {
				'-webkit-transform': 'none'
				'-moz-transform': 'none'
				'-o-transform': 'none'
				'-ms-transform': 'none'
				'transform': 'none'
			}

		untrackMouseMovements: ->
			@frame?.removeEventListener "mousemove", @mousemove
			@frame?.removeEventListener "mouseleave", @mouseout


		refreshTransform: (root)->
			return if @disabled is on

			root = root.trim() if typeof root is 'string'
			fromRoot = not root or root is @transformedLayer

			root ?= @transformedLayer
			rootNode = if typeof root is 'string' then @transformedLayer.querySelector(root) else root

			console.log "rootNode: #{DomUtil.getDebugName rootNode}" if @debug is on

			transformer = new Transformer(
				from: rootNode
				isRoot: fromRoot
				transformAttribute: @transformAttribute
				debug: @debug
			)

			transformer.on.complete.register (sender, isRoot)=>
				@onrefresh?(sender, isRoot)

			transformer.on.complete.register (sender, isRoot)=>
				if isRoot and not @_enableTriggered
					@_enableTriggered = yes
					@onenable?(sender, isRoot)

			layers = transformer.applyTransform()

			if fromRoot then @layers = layers

			layers


		refresh: ->
			return if @disabled is on

			if @frame
				@untrackMouseMovements()
				@animation?.pause()

			@find3dFrames()
			@addPerspective()
			layers = @refreshTransform()

			if not @frozen
				@trackMouseMovements()
				@animation?.play @transformedLayer, @transformAttribute

			layers


		start: -> @enable()


		enable: ->
			return if @disabled is off

			@disabled = off
			@_enableTriggered = no

			if not @ready
				try
					@onready?()
				catch error
					console.error '[AvalonA] - enable - Error occured on ready', error

				@ready = yes

			@refresh()


		disable: ->
			return if @disabled is on

			if @frame
				@untrackMouseMovements()
				@disableRotationEvent()
				@animation?.pause()
				@flatten()
				@removePerspective()

			@disabled = on


		disableRotationEvent: ->
			clearTimeout @rotationTimeoutId
			if @rotating
				@rotating = off
				@onendrotation?()


		flatten: ->
			@resetTransform()

			for node in @transformedLayer.querySelectorAll("[#{Transformer.CSS_BACKUP_ATTRIBUTE}]")
				console.log "flattening layer '#{DomUtil.getDebugName node}'" if @debug is on
				css = JSON.parse node.getAttribute(Transformer.CSS_BACKUP_ATTRIBUTE)
				_TweenLite.set node, css: css


		freeze: ->
			return if @disabled is yes or @frozen is yes or not @frame

			@untrackMouseMovements()
			@disableRotationEvent()
			@animation?.pause()
			@frozen = yes


		release: ->
			return if @disabled is yes or @frozen is no or not @frame

			@trackMouseMovements()
			@animation?.play @transformedLayer, @transformAttribute
			@frozen = no


		init: (options)->
			@transformAttribute = options.tAttr or 'data-avalonA-transform'
			@fx = if typeof options.fx is 'function' then options.fx else noeffect
			@fy = if typeof options.fy is 'function' then options.fy else noeffect
			@activeArea = new ActiveArea(options.activeArea) if options.activeArea
			@activeArea?.debug = @debug

			if options.on then {
				startrotation: @onstartrotation
				endrotation: @onendrotation
				ready: @onready
				refresh: @onrefresh
				enable: @onenable
			} = options.on

			@animation = options.animation
			@idleTimeout = parseInt(options.idleTimeout or 1000, 10)

			if @animation then @assertAnimatorValid()

			Object.defineProperties(
				@
				onstart:
					get: -> @onenable
					set: (onstart)-> @onenable = onstart
			)


		assertAnimatorValid: ->
			throw new Error "animation.play must be a function" if not @animation.play or typeof @animation.play isnt 'function'
			throw new Error "animation.pause must be a function" if not @animation.pause or typeof @animation.pause isnt 'function'


		constructor: (@frameId, @layerId, options = {})->
			throw new Error "frameId argument cannot be null" if not @frameId
			throw new Error "layerId argument cannot be null" if not @layerId
			@debug = options.debug
			detectTransformStyleSupport()
			console.log "transformStyleIsSupported: #{transformStyleIsSupported}" if @debug is on

			if transformStyleIsSupported
				@init options
			else
				@flatten =
				@disableRotationEvent =
				@disable =
				@start =
				@enable =
				@refresh =
				@applyTransformOn =
				@refreshChildTransform =
				@refreshTransform =
				@untrackMouseMovements =
				@trackMouseMovements =
				@addPerspective =
				@removePerspective = ->


	#======================================== Public API =============================================
	(frameId, layerId, options)-> new Frame3d(frameId, layerId, options)


### Export ###

if typeof define is 'function' and define.amd
	define 'AvalonA', ['tweenlite'], (tweenlite)->
		_TweenLite = tweenlite
		do defineAvalonA
else
	_TweenLite = window.GreenSockGlobals?.TweenLite or TweenLite
	window.AvalonA = do defineAvalonA

