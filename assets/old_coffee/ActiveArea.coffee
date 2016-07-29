dimensionPattern = /^\d+(%|px)?$/gi

validDimension = (dimension)->
	dimensionPattern.lastIndex = 0
	result = dimensionPattern.test dimension
	dimensionPattern.lastIndex = 0
	result

class ActiveArea
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
			@xMaxComputation = -> @xMin + (@width / 100) * parseInt(getComputedStyle(@frame).width, 10)
		else
			@xMaxComputation = -> @xMin + @width

		if @heightIsFluid
			@yMaxComputation = -> @yMin + (@height / 100) * parseInt(getComputedStyle(@frame).height, 10)
		else
			@yMaxComputation = -> @yMin + @height

		if @attachment is 'fixed'
			@xPadding = @frame.scrollLeft
			@yPadding = @frame.scrollTop

			if @debug is on
				console.log "Listen to scroll event"
				self = @
				scrollDebugCode = -> console.log "Scroll : @xPadding = #{self.xPadding}, @yPadding = #{self.yPadding}"
			else
				scrollDebugCode = ->

			windowScrollCount = 0
			window.addEventListener(
				'scroll'
				=>
					return if ++windowScrollCount % 5 > 0
					@xPadding = window.pageXOffset
					@yPadding = window.pageYOffset
					@refreshBounds()
					scrollDebugCode()

				no
			)

			frameScrollCount = 0
			@frame.addEventListener(
				'scroll'
				=>
					return if ++frameScrollCount % 5 > 0
					@xPadding = @frame.scrollLeft
					@yPadding = @frame.scrollTop
					@refreshBounds()
					scrollDebugCode()

				no
			)
		else
			@xPadding = @yPadding = 0

		if @debug is on
			self = @
			resizeDebugCode = -> console.log "Resize : @frame.style.width = #{getComputedStyle(self.frame).width}, @frame.style.height = #{getComputedStyle(self.frame).height}"
		else
			resizeDebugCode = ->

		window.addEventListener(
			'resize'
			=>
				@xBase = xBaseComputation()
				@yBase = yBaseComputation()
				@refreshBounds()
				resizeDebugCode()

			no
		)

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
		frameWidth = parseInt(getComputedStyle(@frame).width, 10)

		if @position.x and @position.x isnt 'auto'
			if dimensionPattern.exec(@position.x)[1] is '%'
				xBaseComputation = => (@x / 100) * frameWidth
			else
				xBaseComputation = => @x

			dimensionPattern.lastIndex = 0
		else
			if @widthIsFluid
				xBaseComputation = => ((50 - @width / 2) / 100) * frameWidth
			else
				xBaseComputation = => frameWidth / 2 - @width / 2

		xBaseComputation


	getYBaseComputation: ->
		frameHeight = parseInt(getComputedStyle(@frame).height, 10)

		if @position.y and @position.y isnt 'auto'
			if dimensionPattern.exec(@position.y)[1] is '%'
				yBaseComputation = => (@y / 100) * frameHeight
			else
				yBaseComputation = => @y

			dimensionPattern.lastIndex = 0
		else
			if @heightIsFluid
				yBaseComputation = => ((50 - @height / 2) / 100) * frameHeight
			else
				yBaseComputation = => frameHeight / 2 - @height / 2

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