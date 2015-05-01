$ ->
	enableAll = ->
		frame3d.enable()
		frame3d2.enable()
		$('#enable').css display: 'none'
		$('#enable2,#enable3').css display: 'none'
		$('#disable,#disable2,#disable3').css display: 'block'
		$('#shuffle-all,#shuffle-one').css display: 'inline'

	frame3d = AvalonA(
		'body-3d'
		'aa3d'
		tAttr: 'at'
		fy: (rotation)->
			0.75 * rotation
		fx: (rotation)->
			2 * rotation

		activeArea:
		#position:
		#  x: 50
		#  y: '10%'
			attachment: 'scroll'
			width: '75%'
			height: 350

		on:
			startrotation: ->
				console.log "3d rotation on"
			endrotation: ->
				console.log "3d rotation off"

		#animation: AvalonAnimation.Balance()
		#animation: AvalonAnimation.Spotlight()

		idleTimeout: -1

		#debug: on
	)

	frame3d2 = AvalonA(
		'body-3d'
		'a3d2'
		tAttr: 'at'
		fy: (rotation)->
			0.75 * rotation
		fx: (rotation)->
			2 * rotation

		activeArea:
			position:
				x: 50
				y: 250
			attachment: 'scroll'
			width: 350
			height: 350

		on:
			startrotation: ->
				console.log "3d II rotation on"
			endrotation: ->
				console.log "3d II rotation off"

		animation: AvalonAnimation.Balance()
		#animation: AvalonAnimation.Spotlight()

		idleTimeout: -1

		debug: on
	)

	layerCursor = 0

	outer = $('[data-outter]')
	outer.attr('id', outer.attr('data-outter'))
	inner = $('[data-inner]')
	inner.attr('id', inner.attr('data-inner'))

	$('#enable').click enableAll

	$('#disable').click ->
		$('#shuffle-all,#shuffle-one').css display: 'none'
		$(@).css display: 'none'
		$('#disable2,#disable3').css display: 'none'
		$('#enable,#enable2,#enable3').css display: 'block'
		frame3d.disable()
		frame3d2.disable()

	$('#shuffle-all').click ->
		$('[at]').each -> $(@).attr 'at': ['z:', Math.round(Math.random() * 400 - 200), '; rx:', Math.random() * 360, '; ry:', Math.random() * 360, '; rz:', Math.random() * 360].join ''
		do frame3d.refreshTransform


	$('#shuffle-one').click ->
		node = $('[at]').eq(layerCursor)
		node.attr 'at': ['z:', Math.round(Math.random() * 400 - 200), '; rx:', Math.random() * 360, '; ry:', Math.random() * 360, '; rz:', Math.random() * 360].join ''
		frame3d.refreshTransform node
		#frame3d.refreshTransform "[at]"
		layerCursor = (layerCursor + 1) % $('[at]').size()

	$('#enable2').click ->
		frame3d2.enable()
		$(@).css display: 'none'
		$('#disable2').css display: 'block'

	$('#disable2').click ->
		frame3d2.disable()
		$(@).css display: 'none'
		$('#enable2').css display: 'block'

	$('#enable3').click ->
		frame3d.enable()
		$(@).css display: 'none'
		$('#disable3').css display: 'block'

	$('#disable3').click ->
		frame3d.disable()
		$(@).css display: 'none'
		$('#enable3').css display: 'block'

	$('#hide').click ->
		$('#aa3d,#a3d2').css display: 'none'
		$(@).css display: 'none'
		$('#show').css display: 'block'

	$('#show').click ->
		$('#aa3d,#a3d2').css display: 'block'
		$(@).css display: 'none'
		$('#hide').css display: 'block'

	###
	speedTester.oncomplete (results)->
		recommendedFps = 30
		console.log "fps: #{results.fps}"

		if results.fps >= recommendedFps
			enableAll()
		else
			console.log("Your frame rate is too low (recommended: #{recommendedFps}fps)")

	###

	console.log "Stalling speed tester"

	setTimeout(
		->
			console.log "Listening to speed tester complete event"

			speedTester.oncomplete (results)->
				recommendedFps = 30
				console.log "fps: #{results.fps}"

				if results.fps >= recommendedFps
					enableAll()
				else
					console.log("Your frame rate is too low (recommended: #{recommendedFps}fps)")
		5000
	)