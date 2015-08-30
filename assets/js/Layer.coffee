class Layer

	@properties = ['x','y','z','rx','ry','rz', 'ox', 'oy', 'oz']

	for property in @properties
		do (property) =>
			propertyPattern = new RegExp "\\b#{property}\\s*:\\s*(-?\\d+(\\.\\d+)?)\\b"

			Object.defineProperty(
				@::,
				property,


				get: ->
					transforms = @node.getAttribute @_transformAttribute
					value = parseFloat(propertyPattern.exec(transforms)?[1].trim(), 10)

					if isNaN value
						unless property[0] is 'o' then 0 else 0.5
					else
						value


				set: (value)->
					numericValue = parseFloat(value, 10)

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