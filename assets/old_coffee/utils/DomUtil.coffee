DomUtil =

	getTransformStyle: (style)->
		style.getPropertyValue('-webkit-transform-style') or
			style.getPropertyValue('-moz-transform-style') or
			style.getPropertyValue('-ms-transform-style') or
			style.getPropertyValue('transform-style')


	getTransform: (style)->
		style.getPropertyValue('-webkit-transform') or
			style.getPropertyValue('-moz-transform') or
			style.getPropertyValue('-o-transform') or
			style.getPropertyValue('-ms-transform') or
			style.getPropertyValue('transform')


	getDebugName: (node)->
		"#{node.tagName}(#{node.id or
		node.getAttribute('class') or
		node.getAttribute('href')})"