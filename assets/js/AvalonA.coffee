### AvalonA 1.0.0 ###
console.log '%cAvalonA 1.0.0', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;'

defineAvalonA = (TweenLite)->
	# @codekit-prepend 'ActiveArea'
	# @codekit-prepend 'Layer'
	#================================================================================================
	class Frame3d
		transitionDuration = 0.75
		noeffect = (rotation)-> rotation
		transformStyleIsSupported = undefined
		cssBackUpAttribute = 'data-css-backup'

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

				transformStyleIsSupported = getTransformStyle(element) is 'preserve-3d'
				document.body.removeChild(element)

			transformStyleIsSupported


		getTransformStyle = (element)->
			computedStyle = getComputedStyle(element, null)
			computedStyle.getPropertyValue('-webkit-transform-style') or computedStyle.getPropertyValue('-moz-transform-style') or computedStyle.getPropertyValue('-ms-transform-style') or computedStyle.getPropertyValue('transform-style')


		debugName = (node)-> "#{node.tagName}(#{node.id or node.getAttribute('class') or node.getAttribute('href')})"


		find3dFrames: ->
			@frame = document.getElementById @frameId
			@transformedLayer = @frame.querySelector "##{@layerId}"

			if @debug is on
				console.log "@transformAttribute: #{@transformAttribute}"
				console.log "@layerId: #{@layerId}"

			throw new Error "Cannot find 3d frame '##{@frameId}' in dom" if not @frame
			throw new Error "Cannot find 3d inner frame '##{@frameId} > ##{@layerId}' in dom" if not @transformedLayer


		addPerspective: ->
			TweenLite.set(
				@transformedLayer
				css: perspective: 1000
			)


		removePerspective: ->
			TweenLite.set(
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

				TweenLite.to(
					@transformedLayer
					0.1
					css:
						rotationX: @fy(@rotationX)
						rotationY: @fx(@rotationY)
				)
			else @disableRotation()


		onrotation: ->
			clearTimeout @rotationTimeoutId

			if not @rotating
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
			TweenLite.to(
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


		refreshTransform: (root = null)->
			return if @disabled is on

			root ?= @transformedLayer
			rootNode = if typeof root is 'string' then @transformedLayer.querySelector(root) else root

			console.log "rootNode: #{debugName rootNode}" if @debug is on

			@applyTransformOn rootNode

			console.log "refreshTransform firstChild: #{debugName rootNode.firstElementChild}" if @debug is on

			layers = all: []

			for child in rootNode.children
				subLayers = @refreshChildTransform child
				layers.all.push subLayers... if subLayers

			if rootNode isnt @transformedLayer and rootNode.getAttribute @transformAttribute
				layers.root = new Layer rootNode, @transformAttribute
				layers.all.push layers.root

			for layer in layers.all
				layers["##{layer.id}"] = layer if layer.id

				if layer.classes
					for cssClass in layer.classes
						classSelector = ".#{cssClass}"
						layers[classSelector] ?= []
						layers[classSelector].push layer

			layers


		refreshChildTransform: (child)=>
			throw new Error "refreshChildTransform child argument cannot be null" if not child

			if child.querySelectorAll("[#{@transformAttribute}]").length
				console.log "refreshTransform child #{debugName child} has children" if @debug is on
				return @refreshTransform(child).all
			else if child.getAttribute @transformAttribute
				console.log "refreshTransform child #{debugName child} has '#{@transformAttribute}'" if @debug is on
				@applyTransformOn child

			[new Layer child, @transformAttribute] if child.getAttribute @transformAttribute


		applyTransformOn: (target)->
			throw new Error "applyTransformOn target argument cannot be null" if not target

			if not target.getAttribute(cssBackUpAttribute)
				targetStyle = getComputedStyle(target)

				backup =
					transformStyle: getTransformStyle(target) or 'flat'
					overflow: targetStyle.overflow or 'inherit'

				transformBackup = targetStyle.getPropertyValue('-webkit-transform') or
					targetStyle.getPropertyValue('-moz-transform') or
					targetStyle.getPropertyValue('-o-transform') or
					targetStyle.getPropertyValue('-ms-transform') or
					targetStyle.getPropertyValue('transform')


				backup.transform = transformBackup if transformBackup

				target.setAttribute(cssBackUpAttribute, JSON.stringify(backup))

			TweenLite.set(
				target
				css:
					transformStyle: 'preserve-3d'
					overflow: 'visible'
			)

			if (attrValue = target.getAttribute @transformAttribute)
				transforms = {};

				for t in attrValue.split(';')
					[prop, value] = t.split(':');
					transforms[prop.trim()] = parseInt value.trim(), 10

				{z:z, rx:rx, ry:ry, rz:rz} = transforms

				if z or rx or ry or rz
					css = {}
					css.z = z if z
					css.rotationX = rx if rx
					css.rotationY = ry if ry
					css.rotationZ = rz if rz

					TweenLite.to(
						target
						transitionDuration
						css: css
					)


		refresh: ->
			@disabled = off

			if not @ready
				try
					@onready?()
				catch error
					console.error 'AvalonA - refresh - Error occured on ready', error
				@ready = yes

			if @frame
				@untrackMouseMovements()
				@animation?.pause()

			@find3dFrames()
			@addPerspective()
			layers = @refreshTransform()
			@trackMouseMovements()
			@onrefresh?()
			@animation?.play @transformedLayer, @transformAttribute
			layers


		start: -> @refresh()

		enable: -> @refresh()

		disable: ->
			if @frame
				@untrackMouseMovements()
				@disableRotationEvent()
				@animation?.pause()
				@flatten()
				@removePerspective()

			@disabled = on


		disableRotationEvent: ->
			clearTimeout @rotationTimeoutId
			@rotating = off
			@onendrotation?()


		flatten: ->
			@resetTransform()

			for node in @transformedLayer.querySelectorAll("[#{cssBackUpAttribute}]")
				console.log "flattening layer '#{debugName node}'" if @debug is on
				css = JSON.parse node.getAttribute(cssBackUpAttribute)
				TweenLite.set node, css: css


		init: (options)->
			@transformAttribute = options.tAttr or 'data-avalonA-transform'
			@fx = if typeof options.fx is 'function' then options.fx else noeffect
			@fy = if typeof options.fy is 'function' then options.fy else noeffect
			@activeArea = new ActiveArea(options.activeArea) if options.activeArea
			@activeArea?.debug = @debug
			@onstartrotation = options.on?.startrotation
			@onendrotation = options.on?.endrotation
			@onready = options.on?.ready
			@onrefresh = options.on and (options.on.refresh or options.on.enable or options.on.start)
			@animation = options.animation
			@idleTimeout = parseInt(options.idleTimeout or 1000, 10)
			@assertAnimatorValid() if @animation

			Object.defineProperties(
				@
				onenable:
					get: -> @onrefresh
					set: (onenable)-> @onrefresh = onenable

				onstart:
					get: -> @onrefresh
					set: (onstart)-> @onrefresh = onstart
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
	define 'AvalonA', ['tweenlite'], (tweenlite)-> defineAvalonA(tweenlite)
else
	window.AvalonA = defineAvalonA(window.GreenSockGlobals?.TweenLite or TweenLite)

