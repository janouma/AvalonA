defineSpeedTester = (global)->
	Ø = Object.create and Object.create(null) or {}

	class SpeedTester

		constructor: -> @frameCount = 0

		run: ->
			requestAnimationFrame = global.requestAnimationFrame or global.mozRequestAnimationFrame or global.webkitRequestAnimationFrame or global.oRequestAnimationFrame

			if requestAnimationFrame?
				requestAnimationFrame @frame
			else console.warn "Your browser doesn't support \"requestAnimationFrame\"" if console?
			@


		frame: (tick)=>
			@frameCount++
			@start = tick if not @start
			if tick - @start < 1000 then requestAnimationFrame @frame else @_complete = yes


		oncomplete: (listener)->
			if @_complete?
				listener.call Ø, fps: @frameCount
			else
				setTimeout(=> @oncomplete listener, 100)

	#======================================== Public API =============================================
	SpeedTester


### Export ###

if typeof define is 'function' and define.amd
	define 'SpeedTester', [], => defineSpeedTester(this)
else
	window.SpeedTester = defineSpeedTester(this)