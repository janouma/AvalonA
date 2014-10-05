defineSpeedTester = (global)->
	Ø = Object.create and Object.create(null) or {}
	second = 1000

	class SpeedTester

		constructor: (times)->
			@frameCount = 0
			@times = times and Math.abs(Math.ceil(times)) or 1


		run: ->
			requestAnimationFrame = global.requestAnimationFrame or global.mozRequestAnimationFrame or global.webkitRequestAnimationFrame or global.oRequestAnimationFrame

			if requestAnimationFrame?
				requestAnimationFrame @_frame
			else console.warn "Your browser doesn't support \"requestAnimationFrame\"" if console?
			@


		_frame: (tick)=>
			@frameCount++
			@start = tick if not @start

			if tick - @start < (second * @times)
				requestAnimationFrame @_frame
			else
				@_testResults = fps: @frameCount / @times
				@_complete = yes
				@_oncomplete and @_oncomplete.call(Ø, @_testResults)


		oncomplete: (@_oncomplete)-> @_complete and @_oncomplete.call(Ø, @_testResults)


	#======================================== Public API =============================================
	SpeedTester


### Export ###

if typeof define is 'function' and define.amd
	define 'SpeedTester', [], => defineSpeedTester(this)
else
	window.SpeedTester = defineSpeedTester(this)