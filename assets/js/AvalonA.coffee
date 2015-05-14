### AvalonA 0.10.2 ###
console.log '%cAvalonA 0.10.2', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;'

defineAvalonA = ($,TweenLite)->

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
				@xMaxComputation = ->
					@xMin + (@width / 100) * @frame.width()
			else
				@xMaxComputation = ->
					@xMin + @width

			if @heightIsFluid
				@yMaxComputation = ->
					@yMin + (@height / 100) * @frame.height()
			else
				@yMaxComputation = ->
					@yMin + @height

			if @attachment is 'fixed'
				@xPadding = @frame.prop('scrollLeft')
				@yPadding = @frame.prop('scrollTop')

				if @debug is on
					console.log "Listen to scroll event"
					self = @
					scrollDebugCode = ->
						console.log "Scroll : @xPadding = #{self.xPadding}, @yPadding = #{self.yPadding}"
				else
					scrollDebugCode = ->

				windowScrollCount = 0
				$(window).scroll =>
					return if ++windowScrollCount % 5 > 0
					@xPadding = $(window).prop 'pageXOffset'
					@yPadding = $(window).prop 'pageYOffset'
					@refreshBounds()
					scrollDebugCode()

				frameScrollCount = 0
				@frame.scroll =>
					return if ++frameScrollCount % 5 > 0
					@xPadding = @frame.prop('scrollLeft')
					@yPadding = @frame.prop('scrollTop')
					@refreshBounds()
					scrollDebugCode()
			else
				@xPadding = @yPadding = 0

			if @debug is on
				self = @
				resizeDebugCode = ->
					console.log "Resize : @frame.width() = #{self.frame.width()}, @frame.height() = #{self.frame.height()}"
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
					xBaseComputation = =>
						(@x / 100) * @frame.width()
				else
					xBaseComputation = =>
						@x

				dimensionPattern.lastIndex = 0
			else
				if @widthIsFluid
					xBaseComputation = =>
						((50 - @width / 2) / 100) * @frame.width()
				else
					xBaseComputation = =>
						@frame.width() / 2 - @width / 2

			xBaseComputation


		getYBaseComputation: ->
			if @position.y and @position.y isnt 'auto'
				if dimensionPattern.exec(@position.y)[1] is '%'
					yBaseComputation = =>
						(@y / 100) * @frame.height()
				else
					yBaseComputation = =>
						@y

				dimensionPattern.lastIndex = 0
			else
				if @heightIsFluid
					yBaseComputation = =>
						((50 - @height / 2) / 100) * @frame.height()
				else
					yBaseComputation = =>
						@frame.height() / 2 - @height / 2

			yBaseComputation


		mouseover: (event)->
			@xMin <= event.pageX <= @xMax and @yMin <= event.pageY <= @yMax


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
		cssBackUpAttribute = 'data-css-backup'

		detectTransformStyleSupport = ->
			if transformStyleIsSupported is null
				id = 'avalona-detection-element'
				body = $('body').prepend "<b id='#{id}' style='position:absolute; top:0; left:0;'></b>"
				element = $ "##{id}"

				element[0].style?.webkitTransformStyle = 'preserve-3d'
				element[0].style?.MozTransformStyle = 'preserve-3d'
				element[0].style?.msTransformStyle = 'preserve-3d'
				element[0].style?.transformStyle = 'preserve-3d'

				transformStyleIsSupported = getTransformStyle(element[0]) is 'preserve-3d'
				element.remove()

			transformStyleIsSupported


		getTransformStyle = (element)->
			computedStyle = getComputedStyle(element, null)
			computedStyle.getPropertyValue('-webkit-transform-style') or computedStyle.getPropertyValue('-moz-transform-style') or computedStyle.getPropertyValue('-ms-transform-style') or computedStyle.getPropertyValue('transform-style')


		debugName = (node)->
			"#{node.prop('tagName')}(#{node.attr('id') or node.attr('class') or node.attr('href')})"

		find3dFrames: ->
			@frame = $("##{@frameId}")
			@transformedLayer = $("##{@layerId}", @frame)

			if @debug is on
				console.log "@transformAttribute: #{@transformAttribute}"
				console.log "@layerId: #{@layerId}"


			throw new Error "Cannot find 3d frame '##{@frameId}' in dom" if not @frame.size()
			throw new Error "Cannot find 3d inner frame '##{@frameId} > ##{@layerId}' in dom" if not @transformedLayer.size()


		addPerspective: ->
			TweenLite.set(
				@transformedLayer[0]
				css: perspective: 1000
			)


		removePerspective: ->
			TweenLite.set(
				@transformedLayer[0]
				css: perspective: 'none'
			)


		trackMouseMovements: ->
			if @debug is on and @activeArea
				$('body').append "<div id='avalona-active-area' style='background-color:hotpink;opacity:0.75;pointer-events:none;position:absolute;visibility:hidden;z-index:10000;'>AvalonA Active Area</div>"

				activeAreaPlaceholder = $('#avalona-active-area')

				@debugMouseMove = ->
					console.log "rotationX: #{@rotationX}, rotationY: #{@rotationY}"

					bounds = @activeArea.bounds()
					activeAreaPlaceholder.css(
						visibility: 'visible'
						left: "#{bounds.xMin}px"
						top: "#{bounds.yMin}px"
						width: "#{bounds.xMax - bounds.xMin}px"
						height: "#{bounds.yMax - bounds.yMin}px"
					)
			else
				@debugMouseMove = ->

			if @activeArea
				@activeArea.init @frame
			else
				@frame.on "mouseleave", "##{@frameId}", @mouseout

			@frame.mousemove @mousemove


		mouseout: => @disableRotation()

		mouseMoveCount: 0

		mousemove: (event)=>
			return if ++@mouseMoveCount % 5 > 0
			if not @activeArea or @activeArea.mouseover(event)
				@onrotation()
				@rotationY = (event.pageX - $(window).prop('innerWidth') / 2) / 25
				@rotationX = -1 * (event.pageY - $(window).prop('innerHeight') / 2) / 15

				@debugMouseMove()

				TweenLite.to(
					@transformedLayer[0]
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
				@transformedLayer[0]
				duration
				css:
					rotationX: 0
					rotationY: 0
			)

		resetTransform: ->
			clearTimeout @rotationTimeoutId
			@rotationX = @rotationY = 0
			@transformedLayer.css
				'-webkit-transform': 'none'
				'-moz-transform': 'none'
				'-o-transform': 'none'
				'-ms-transform': 'none'
				transform: 'none'


		untrackMouseMovements: ->
			@frame?.off "mousemove", @mousemove
			@frame?.off "mouseleave", @mouseout


		refreshTransform: (node = null)->
			return if @disabled is on

			self = @
			node ?= @transformedLayer
			target = if typeof node is 'string' then $(node, @transformedLayer) else $(node)

			console.log "target: #{debugName target}" if @debug is on

			@applyTransformOn target
			firstChild = target.children().eq(0)

			console.log "refreshTransform firstChild: #{debugName firstChild}" if @debug is on

			@refreshChildTransform(firstChild).siblings().each ->
				self.refreshChildTransform $(@)


		refreshChildTransform: (child)=>
			throw new Error "refreshChildTransform child argument cannot be null" if not child

			if $("[#{@transformAttribute}]", child).length
				console.log "refreshTransform child #{debugName child} has children" if @debug is on
				@refreshTransform child
			else if child.attr @transformAttribute
				console.log "refreshTransform child #{debugName child} has '#{@transformAttribute}'" if @debug is on
				@applyTransformOn child

			child


		applyTransformOn: (target)->
			throw new Error "applyTransformOn target argument cannot be null" if not target

			if not target.attr(cssBackUpAttribute)
				backup =
					transformStyle: getTransformStyle(target[0]) or 'flat'
					overflow: target.css('overflow') or 'inherit'

				transformBackup = target.css('-webkit-transform') or
					target.css('-moz-transform') or
					target.css('-o-transform') or
					target.css('-ms-transform') or
					target.css('transform')


				backup.transform = transformBackup if transformBackup

				target.attr(cssBackUpAttribute, JSON.stringify(backup))

			TweenLite.set(
				target[0]
				css:
					transformStyle: 'preserve-3d'
					overflow: 'visible'
			)

			if (attrValue = target.attr @transformAttribute)
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
						target[0]
						transitionDuration
						css: css
					)


		refresh: ->
			@disabled = off

			if @frame
				@untrackMouseMovements()
				@animation?.pause()

			@find3dFrames()
			@addPerspective()
			@refreshTransform()
			@trackMouseMovements()
			@animation?.play @transformedLayer[0], @transformAttribute


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
			self = @

			$("[#{cssBackUpAttribute}]", @transformedLayer[0]).each ->
				console.log "flattening layer '#{debugName $(@)}'" if self.debug is on
				css = JSON.parse $(@).attr(cssBackUpAttribute)
				TweenLite.set @, css: css


		init: (options)->
			@transformAttribute = options.tAttr or 'data-avalonA-transform'
			@fx = if typeof options.fx is 'function' then options.fx else noeffect
			@fy = if typeof options.fy is 'function' then options.fy else noeffect
			@activeArea = new ActiveArea(options.activeArea) if options.activeArea
			@activeArea?.debug = @debug
			@onstartrotation = options.on?.startrotation
			@onendrotation = options.on?.endrotation
			@animation = options.animation
			@idleTimeout = parseInt(options.idleTimeout or 1000, 10)
			@assertAnimatorValid() if @animation


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
	(frameId, layerId, debug = false)-> new Frame3d(frameId, layerId, debug)


### Export ###

if typeof define is 'function' and define.amd
	define 'AvalonA', ['jquery','tweenlite'], (jquery, tweenlite)-> defineAvalonA(jquery,tweenlite)
else
	window.AvalonA = defineAvalonA($, window.GreenSockGlobals?.TweenLite or TweenLite)

