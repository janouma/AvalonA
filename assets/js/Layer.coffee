class Layer

	for property in ['z','rx','ry','rz']
		do (property) =>
			propertyPattern = new RegExp "\\b#{property}\\s*:\\s*(-?\\w+)\\b"

			Object.defineProperty(
				@::,
				property,


				get: ->
					transforms = @_node.getAttribute @_transformAttribute
					parseInt(propertyPattern.exec(transforms)?[1].trim() or 0, 10)


				set: (value)->
					numericValue = parseInt(value, 10)

					if isNaN numericValue
						throw "[Layer] - set #{property} - value (#{value}) is not valid"

					transforms = (@_node.getAttribute @_transformAttribute).trim()

					if propertyPattern.test transforms
						newTransforms = transforms.replace propertyPattern, "#{property}:#{numericValue}"
					else
						newTransforms = "#{property}:#{numericValue}"
						newTransforms = "#{transforms}; #{newTransforms}" if transforms

					@_node.setAttribute @_transformAttribute, newTransforms
			)


	constructor: (@_node, @_transformAttribute)->
		@id = @_node.id if @_node.id
		@classes = (cssClass for cssClass in @_node.className.split /\s+/g) if @_node.className