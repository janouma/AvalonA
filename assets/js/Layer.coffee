class Layer

	###
	for property in [
			'z'
			'rx'
			'ry'
			'rz'
		]
		Object.defineProperty(
			@::,
			property,

			get: ->
				propertyPattern = new RegExp("\\b#{property}\\s*:\\s*(\\w+)\\b")
				propertyPattern.exec(@_node.getAttribute @_transformAttribute)[1]?.trim() or 0
		)
	###

	constructor: (@_node, @_transformAttribute)->
		@id = @_node.id if @_node.id
		@classes = (cssClass for cssClass in @_node.className.split /\s+/g) if @_node.className