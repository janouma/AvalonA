class Transformer
	@CSS_BACKUP_ATTRIBUTE: 'data-css-backup'
	@TRANSITION_DURATION: 0.75
	_static: @



	constructor: (params)->
		@_from = params.from
		@_isRoot = params.isRoot
		@_transformAttribute = params.transformAttribute
		@_debug = params.debug or no

		if not @_from then throw "[Transformer] - constructor - from argument must be defined"
		if not @_transformAttribute then throw "[Transformer] - constructor - transformAttribute argument must be defined"
		if not @_isRoot? then throw "[Transformer] - constructor - isRoot argument must be defined"

		@on = complete: new Signal



	applyTransform: ->
		do @_calcTransformsCount
		@_applyTransform @_from, @_isRoot



	_calcTransformsCount: ->
		transformAttribute = @_transformAttribute
		from = @_from
		@_transformsCount = from.querySelectorAll("[#{transformAttribute}]").length
		if from.getAttribute(transformAttribute) then @_transformsCount++


	_applyTransform: (from, isRoot = no)->
		layers = @_layers = all: []
		transformAttribute = @_transformAttribute

		@_applyOn from

		if @_debug is on
			debugNode = from.firstElementChild
			if debugNode then console.log  "[Transformer] - refreshTransform - firstChild: #{DomUtil.getDebugName debugNode}"

		for child in from.children
			subLayers = @_refreshChildTransform child
			layers.all.push subLayers... if subLayers

		if not isRoot and from.getAttribute transformAttribute
			layers.root = new Layer from, transformAttribute
			layers.all.push layers.root

		if isRoot
			for layer in layers.all
				layers["##{layer.id}"] = layer if layer.id

				unless layer.registered
					layer.registered = yes

					layer.on.refresh.register (layer)=>
						transformer = new Transformer(
							from: layer.node
							isRoot: no
							transformAttribute: transformAttribute
							debug: @_debug
						)

						transformer.on.complete.register (sender, data)=> @on.complete.send sender, data
						transformer.applyTransform()

				if layer.classes
					for cssClass in layer.classes
						classSelector = ".#{cssClass}"
						layers[classSelector] ?= []
						layers[classSelector].push layer

		layers



	_refreshChildTransform: (child)->
		if not child then throw "[Transformer] - _refreshChildTransform - child argument cannot be null"

		transformAttribute = @_transformAttribute

		if child.querySelectorAll("[#{transformAttribute}]").length
			if @_debug is on then console.log "[Transformer] - _refreshChildTransform - child #{DomUtil.getDebugName child} has children"
			return @_applyTransform(child).all
		else if child.getAttribute transformAttribute
			if @_debug is on then console.log "[Transformer] - _refreshChildTransform - child #{DomUtil.getDebugName child} has '#{transformAttribute}'"
			@_applyOn child

		if child.getAttribute transformAttribute then [new Layer child, transformAttribute]



	_applyOn: (target)->
		if not target then throw "[Transformer] - _applyOn - target argument cannot be null"

		transformAttribute = @_transformAttribute

		@_backup target

		TweenLite.set(
			target
			css:
				transformStyle: 'preserve-3d'
				overflow: 'visible'
		)

		if (attrValue = target.getAttribute transformAttribute)
			transforms = {}

			for t in attrValue.split(';') when t.trim()
				[prop, value] = t.split(':');
				transforms[prop.trim()] = parseFloat value.trim(), 10

			{
				x: x
				y: y
				z: z
				rx: rx
				ry: ry
				rz: rz
				ox: ox
				oy: oy
				oz: oz
			} = transforms

			if x or y or z or rx or ry or rz or ox or oy or oz
				css = {}
				css.x = x if x
				css.y = y if y
				css.z = z if z
				css.rotationX = rx if rx
				css.rotationY = ry if ry
				css.rotationZ = rz if rz

				transformOrigin = []
				for o in [oz,oy,ox] when o? or transformOrigin.length > 0
					transformOrigin.unshift("#{100 * (if o? then o else 0.5)}%")

				if transformOrigin.length > 0 then css.transformOrigin = transformOrigin.join(' ')

				TweenLite.to(
					target
					@_static.TRANSITION_DURATION
					css: css
				).eventCallback 'onComplete', @_onTweenComplete



	_backup: (target)->
		if not target.getAttribute(@_static.CSS_BACKUP_ATTRIBUTE)
			targetStyle = getComputedStyle(target)

			backup =
				transformStyle: DomUtil.getTransformStyle(targetStyle) or 'flat'
				overflow: targetStyle.overflow or 'inherit'

			transformBackup = DomUtil.getTransform targetStyle
			if transformBackup then backup.transform = transformBackup

			target.setAttribute(Transformer.CSS_BACKUP_ATTRIBUTE, JSON.stringify(backup))



	_onTweenComplete:=>
		if @_debug is on then console.log "[Transformer] - _onTweenComplete - @_transformsCount: #{@_transformsCount}"
		if --@_transformsCount is 0 then @on.complete.send @_from, @_isRoot