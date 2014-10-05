defineSpeedTester = (global)->
	Ø = Object.create and Object.create(null) or {}
	second = 1000

	class SpeedTester

		constructor: (times)->
			@frameCount = 0
			@times = times and Math.abs(Math.ceil(times)) or 1


		run: ->
			requestAnimationFrame = global.requestAnimationFrame or global.mozRequestAnimationFrame or global.webkitRequestAnimationFrame or global.oRequestAnimationFrame

			@_testResults = {}
			@_complete = no

			if requestAnimationFrame
				requestAnimationFrame @_frame
			else
				console.warn "Your browser doesn't support \"requestAnimationFrame\"" if console?
				do @_triggerComplete
			@


		_triggerComplete: ->
			@_testResults = fps: @frameCount / @times
			@_complete = yes
			@_oncomplete and @_oncomplete.call(Ø, @_testResults)


		_frame: (tick)=>
			@frameCount++
			@start = tick if not @start

			if tick - @start < (second * @times)
				requestAnimationFrame @_frame
			else do @_triggerComplete


		oncomplete: (@_oncomplete)-> @_complete and @_oncomplete.call(Ø, @_testResults)


	#======================================== Public API =============================================
	SpeedTester


### Export ###

if typeof define is 'function' and define.amd
	define 'SpeedTester', [], => defineSpeedTester(this)
else
	window.SpeedTester = defineSpeedTester(this)