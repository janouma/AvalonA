class Signal

	_Ø: Object.create(null)

	register: (listener)->
		if typeof listener is 'function'
			(@_listeners ?= []).push listener

	unregister: (listener)->
		if @_listeners
			index = @_listeners.indexOf listener
			@_listeners.splice index, 1 unless index < 0

	clear: -> @_listener = undefined

	send: (sender, data) ->
		if @_listeners
			listener.call(@_Ø, sender, data) for listener in @_listeners
