defineSpeedTester = ()->
	class SpeedTester

		constructor: (@benchmarkUrl)->
			throw new Error 'You must specify the benchmark url' if not @benchmarkUrl

		run: ->
			if Worker?
				window.addEventListener(
						'unload'
					=>
						@worker?.terminate()
				)

				@worker = new Worker @benchmarkUrl
				@worker.onmessage = (event)=> @message = JSON.parse(event.data)
				@worker.postMessage "start"

			else console.warn "Your browser doesn't support the worker api" if console?
			@

		oncomplete: (handler)->
			return if not Worker?
			throw new Error 'You must provide a valid handler' if not handler or typeof handler isnt 'function'

			if @message?
				handler @message
			else
				setTimeout(
					=>
						@oncomplete handler
					100
				)

	#======================================== Public API =============================================
	SpeedTester


### Export ###

if typeof define is 'function' and define.amd
	define 'SpeedTester', [], ()-> defineSpeedTester()
else
	window.SpeedTester = defineSpeedTester()