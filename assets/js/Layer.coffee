class Layer
	constructor: (@_node)->
		@id = @_node.id if @_node.id
		@classes = (cssClass for cssClass in @_node.className.split /\s+/g) if @_node.className