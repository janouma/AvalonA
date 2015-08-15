class Layer

	@properties = ['z','rx','ry','rz']

	for property in @properties
		do (property) =>
			propertyPattern = new RegExp "\\b#{property}\\s*:\\s*(-?\\w+)\\b"

			Object.defineProperty(
				@::,
				property,


				get: ->
					transforms = @node.getAttribute @_transformAttribute
					parseInt(propertyPattern.exec(transforms)?[1].trim() or 0, 10)


				set: (value)->
					numericValue = parseInt(value, 10)

					if isNaN numericValue
						throw "[Layer] - set #{property} - value (#{value}) is not valid"

					transforms = (@node.getAttribute @_transformAttribute).trim()

					if propertyPattern.test transforms
						newTransforms = transforms.replace propertyPattern, "#{property}:#{numericValue}"
					else
						newTransforms = "#{property}:#{numericValue}"
						newTransforms = "#{transforms}; #{newTransforms}" if transforms

					@node.setAttribute @_transformAttribute, newTransforms
			)


	constructor: (@node, @_transformAttribute)->
		@id = @node.id if @node.id
		@classes = (cssClass for cssClass in @node.className.split /\s+/g) if @node.className
		@on = refresh: new Signal


	refresh: -> @on.refresh.send @


	transform: (properties)->
		for property, value of properties when property in Layer.properties
			@[property] = value