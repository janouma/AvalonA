class Layer

	for property in ['z','rx','ry','rz']
		do (property) =>
			Object.defineProperty(
				@::,
				property,

				get: ->
					propertyPattern = new RegExp("\\b#{property}\\s*:\\s*(\\w+)\\b")
					transformations = @_node.getAttribute @_transformAttribute
					parseInt(propertyPattern.exec(transformations)?[1].trim() or 0, 10)
			)


	constructor: (@_node, @_transformAttribute)->
		@id = @_node.id if @_node.id
		@classes = (cssClass for cssClass in @_node.className.split /\s+/g) if @_node.className