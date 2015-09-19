window.onload = ->
	frame3dLayers = undefined
	frame3d2Layers = undefined

	enableAll = ->
		console.debug frame3d.enable()
		console.debug frame3d2.enable()

		document.getElementById('enable').style.display = 'none'
		node.style.display = 'none' for node in document.querySelectorAll('#enable2,#enable3')
		node.style.display = 'block' for node in document.querySelectorAll('#disable,#disable2,#disable3')
		node.style.display = 'inline' for node in document.querySelectorAll('#shuffle-all,#shuffle-one')

	frame3d = AvalonA(
		'body-3d'
		'aa3d'
		tAttr: 'at'
		fy: (rotation)->
			0.75 * rotation
		fx: (rotation)->
			2 * rotation

		activeArea:
			###
			position:
				x: 50
				y: '10%'
			###
			attachment: 'scroll'
			width: '75%'
			height: 350

		on:
			startrotation: -> console.log "3d rotation on"
			endrotation: -> console.log "3d rotation off"
			ready: -> console.log 'frame3d is ready'

			enable: (from, root)->
				console.log(
					'frame3d is enabled: from ='
					(from.id or from.tagName)
					'; root:'
					root
				)

		#animation: AvalonAnimation.Balance()
		#animation: AvalonAnimation.Spotlight()
		animation: AvalonAnimation.Atom({
			duration: 20
			selector: '.gravity'
			axis: ['y']
		})

		#idleTimeout: -1

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
			startrotation: -> console.log "3d II rotation on"
			endrotation: -> console.log "3d II rotation off"
			ready: -> console.log 'frame3d II is ready'

		animation: AvalonAnimation.Balance()
		#animation: AvalonAnimation.Spotlight()

		idleTimeout: -1

		debug: on
	)

	frame3d2.onenable = (from, root)->
		console.log(
			'frame3d II is enabled: from ='
			(from.id or from.tagName)
			'; root:'
			root
		)

	layerCursor = 0

	outer = document.querySelector('[data-outter]')
	outer.setAttribute('id', outer.getAttribute('data-outter'))
	inner = document.querySelector('[data-inner]')
	inner.setAttribute('id', inner.getAttribute('data-inner'))

	document.getElementById('enable').addEventListener 'click', enableAll, false

	document.getElementById('disable').addEventListener(
		'click'
		->
			node.style.display = 'none' for node in document.querySelectorAll('#shuffle-all,#shuffle-one')
			this.style.display = 'none'
			node.style.display = 'none' for node in document.querySelectorAll('#disable2,#disable3')
			node.style.display = 'block' for node in document.querySelectorAll('#enable,#enable2,#enable3')
			frame3d.disable()
			frame3d2.disable()

		false
	)

	document.getElementById('shuffle-all').addEventListener(
		'click'
		->
			for layer in frame3d.layers.all
				layer.transform(
					x	: Math.round(Math.random() * 400 - 200)
					y	: Math.round(Math.random() * 400 - 200)
					z	: Math.round(Math.random() * 400 - 200)
					rx	: Math.random() * 360
					ry	: Math.random() * 360
					rz	: Math.random() * 360
					ox	: Math.random()
					oy	: Math.random()
					oz	: Math.random()
				)

			do frame3d.refreshTransform

			console.debug '1. frame3d.layers:', frame3d.layers

			for layer in frame3d2.layers.all
				layer.transform(
					x	: Math.round(Math.random() * 400 - 200)
					y	: Math.round(Math.random() * 400 - 200)
					z	: Math.round(Math.random() * 400 - 200)
					rz	: Math.random() * 360
					ox	: Math.random()
					oy	: Math.random()
					oz	: Math.random()
				)

			do frame3d2.refreshTransform

			console.debug '1. frame3d2.layers:', frame3d2.layers

		no
	)


	document.getElementById('shuffle-one').addEventListener(
		'click'
		->
			layers = [frame3d.layers.all..., frame3d2.layers.all...]
			layer = layers[layerCursor]

			layer.transform(
				x	: Math.round(Math.random() * 400 - 200)
				y	: Math.round(Math.random() * 400 - 200)
				z	: Math.round(Math.random() * 400 - 200)
				rz	: Math.random() * 360
				ox	: Math.random()
				oy	: Math.random()
				oz	: Math.random()
			)

			layerCursor = (layerCursor + 1) % layers.length
			layer.refresh()

			console.debug '2. frame3d.layers:', frame3d.layers
			console.debug '2. frame3d2.layers:', frame3d2.layers

			#frame3d.refreshTransform layer.node
			#frame3d.refreshTransform "[at]"

		false
	)

	document.getElementById('enable2').addEventListener(
		'click'
		->
			frame3d2.enable()
			this.style.display = 'none'
			document.getElementById('disable2').style.display = 'block'

		false
	)

	document.getElementById('disable2').addEventListener(
		'click'
		->
			frame3d2.disable()
			this.style.display = 'none'
			document.getElementById('enable2').style.display = 'block'

		no
	)

	document.getElementById('enable3').addEventListener(
		'click'
		->
			frame3d.enable()
			this.style.display = 'none'
			document.getElementById('disable3').style.display = 'block'

		no
	)

	document.getElementById('disable3').addEventListener(
		'click'
		->
			frame3d.disable()
			this.style.display = 'none'
			document.getElementById('enable3').style.display = 'block'

		no
	)

	document.getElementById('hide').addEventListener(
		'click'
		->
			node.style.display = 'none' for node in document.querySelectorAll('#aa3d,#a3d2')
			this.style.display = 'none'
			document.getElementById('show').style.display = 'block'

		no
	)

	document.getElementById('show').addEventListener(
		'click'
		->
			node.style.display = 'block' for node in document.querySelectorAll('#aa3d,#a3d2')
			this.style.display = 'none'
			document.getElementById('hide').style.display = 'block'

		no
	)

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