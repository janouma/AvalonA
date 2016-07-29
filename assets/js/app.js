window.onload = function () {
  let enableAll = function () {
    console.debug(frame3d.enable())
    console.debug(frame3d2.enable())

    let iterable = document.querySelectorAll('#enable,#enable2,#enable3')
    for (let i = 0; i < iterable.length; i++) {
      let node = iterable[i]
      node.style.display = 'none'
    }

    let iterable1 = document.querySelectorAll('#disable2,#disable3')
    for (let j = 0; j < iterable1.length; j++) {
      let node = iterable1[j]
      node.style.display = 'block'
    }

    return document.querySelectorAll('#disable,#shuffle-all,#shuffle-one').map((node) => (node.style.display = 'inline'))
  }

  var frame3d = AvalonA(
    'body-3d',
    'aa3d', {
      tAttr: 'at',
      fy (rotation) {
        return 0.75 * rotation
      },
      fx (rotation) {
        return 2 * rotation
      },

      activeArea: {
        /*
        position:
        	x: 50
        	y: '10%'
        */
        attachment: 'scroll',
        width: '75%',
        height: 350
      },

      on: {
        startrotation () { return console.log('3d rotation on') },
        endrotation () { return console.log('3d rotation off') },
        ready () { return console.log('frame3d is ready') },

        enable (from, root) {
          return console.log(
            'frame3d is enabled: from =',
            (from.id || from.tagName),
            '; root:',
            root
          )
        },

        refresh (from, root) {
          return console.log(
            'frame3d has been refreshed: from =',
            (from.id || from.tagName),
            '; root:',
            root
          )
        }
      },

      // animation: AvalonAnimation.Balance()
      // animation: AvalonAnimation.Spotlight()
      animation: AvalonAnimation.Atom({
        duration: 20,
        selector: '.gravity',
        axis: ['y']
      })
    }

    // idleTimeout: -1

  // debug: on
  )

  var frame3d2 = AvalonA(
    'body-3d',
    'a3d2', {
      tAttr: 'at',
      fy (rotation) {
        return 0.75 * rotation
      },
      fx (rotation) {
        return 2 * rotation
      },

      activeArea: {
        position: {
          x: 50,
          y: 250
        },
        attachment: 'scroll',
        width: 350,
        height: 350
      },

      on: {
        startrotation () { return console.log('3d II rotation on') },
        endrotation () { return console.log('3d II rotation off') },
        ready () { return console.log('frame3d II is ready') }
      },

      animation: AvalonAnimation.Balance(),
      // animation: AvalonAnimation.Spotlight()

      idleTimeout: -1,

      debug: true
    }
  )

  // shouldn't appear
  frame3d2.onstart = () => console.log('frame3d II is started')

  frame3d2.onenable = (from, root) => console.log(
    'frame3d II is enabled: from =',
    (from.id || from.tagName),
    '; root:',
    root
  )

  frame3d2.onrefresh = (from, root) => console.log(
    'frame3d II has been refreshed: from =',
    (from.id || from.tagName),
    '; root:',
    root
  )

  let layerCursor = 0

  let outer = document.querySelector('[data-outter]')
  outer.setAttribute('id', outer.getAttribute('data-outter'))
  let inner = document.querySelector('[data-inner]')
  inner.setAttribute('id', inner.getAttribute('data-inner'))

  document.getElementById('enable').addEventListener('click', enableAll, false)

  document.getElementById('disable').addEventListener(
    'click',
    function () {
      let iterable = document.querySelectorAll('#shuffle-all,#shuffle-one')
      for (let i = 0; i < iterable.length; i++) {
        let node = iterable[i]
        node.style.display = 'none'
      }
      this.style.display = 'none'
      let iterable1 = document.querySelectorAll('#disable2,#disable3')
      for (let j = 0; j < iterable1.length; j++) {
        let node = iterable1[j]
        node.style.display = 'none'
      }
      document.querySelector('#enable').style.display = 'inline'
      let iterable2 = document.querySelectorAll('#enable2,#enable3')
      for (let k = 0; k < iterable2.length; k++) {
        let node = iterable2[k]
        node.style.display = 'block'
      }
      frame3d.disable()
      return frame3d2.disable()
    },

    false
  )

  document.getElementById('shuffle-all').addEventListener(
    'click',
    function () {
      for (let i = 0; i < frame3d.layers.all.length; i++) {
        let layer = frame3d.layers.all[i]
        layer.transform({
          x: Math.round((Math.random() * 400) - 200),
          y: Math.round((Math.random() * 400) - 200),
          z: Math.round((Math.random() * 400) - 200),
          rx: Math.random() * 360,
          ry: Math.random() * 360,
          rz: Math.random() * 360,
          ox: Math.random(),
          oy: Math.random(),
          oz: Math.random()
        })
      }

      frame3d.refreshTransform()

      console.debug('1. frame3d.layers:', frame3d.layers)

      for (let j = 0; j < frame3d2.layers.all.length; j++) {
        let layer = frame3d2.layers.all[j]
        layer.transform({
          x: Math.round((Math.random() * 400) - 200),
          y: Math.round((Math.random() * 400) - 200),
          z: Math.round((Math.random() * 400) - 200),
          rz: Math.random() * 360,
          ox: Math.random(),
          oy: Math.random(),
          oz: Math.random()
        })
      }

      frame3d2.refreshTransform()

      return console.debug('1. frame3d2.layers:', frame3d2.layers)
    },

    false
  )

  document.getElementById('shuffle-one').addEventListener(
    'click',
    function () {
      let layers = [...frame3d.layers.all, ...frame3d2.layers.all]
      let layer = layers[layerCursor]

      layer.transform({
        x: Math.round((Math.random() * 400) - 200),
        y: Math.round((Math.random() * 400) - 200),
        z: Math.round((Math.random() * 400) - 200),
        rz: Math.random() * 360,
        ox: Math.random(),
        oy: Math.random(),
        oz: Math.random()
      })

      layerCursor = (layerCursor + 1) % layers.length
      layer.refresh()

      console.debug('2. frame3d.layers:', frame3d.layers)
      return console.debug('2. frame3d2.layers:', frame3d2.layers)
    },

    // frame3d.refreshTransform layer.node
    // frame3d.refreshTransform "[at]"

    false
  )

  document.getElementById('enable2').addEventListener(
    'click',
    function () {
      frame3d2.enable()
      this.style.display = 'none'
      document.getElementById('disable2').style.display = 'block'
    },

    false
  )

  document.getElementById('disable2').addEventListener(
    'click',
    function () {
      frame3d2.disable()
      this.style.display = 'none'
      document.getElementById('enable2').style.display = 'block'
    },

    false
  )

  document.getElementById('enable3').addEventListener(
    'click',
    function () {
      frame3d.enable()
      this.style.display = 'none'
      document.getElementById('disable3').style.display = 'block'
    },

    false
  )

  document.getElementById('disable3').addEventListener(
    'click',
    function () {
      frame3d.disable()
      this.style.display = 'none'
      document.getElementById('enable3').style.display = 'block'
    },

    false
  )

  document.getElementById('hide').addEventListener(
    'click',
    function () {
      let iterable = document.querySelectorAll('#aa3d,#a3d2')
      for (let i = 0; i < iterable.length; i++) {
        let node = iterable[i]
        node.style.display = 'none'
      }
      this.style.display = 'none'
      document.getElementById('show').style.display = 'inline'
    },

    false
  )

  document.getElementById('show').addEventListener(
    'click',
    function () {
      let iterable = document.querySelectorAll('#aa3d,#a3d2')
      for (let i = 0; i < iterable.length; i++) {
        let node = iterable[i]
        node.style.display = 'block'
      }
      this.style.display = 'none'
      document.getElementById('hide').style.display = 'inline'
    },

    false
  )

  document.getElementById('freeze').addEventListener(
    'click',
    function () {
      frame3d.freeze()
      frame3d2.freeze()

      if (frame3d.frozen && frame3d2.frozen) {
        let iterable = document.querySelectorAll('#freeze,#freeze2,#freeze3')
        for (let i = 0; i < iterable.length; i++) {
          let node = iterable[i]
          node.style.display = 'none'
        }
        document.querySelectorAll('#release,#release2,#release3').map((node) => (node.style.display = 'inline'))
      }
    },

    false
  )

  document.getElementById('release').addEventListener(
    'click',
    function () {
      frame3d.release()
      frame3d2.release()

      if (!frame3d.frozen && !frame3d2.frozen) {
        let iterable = document.querySelectorAll('#release,#release2,#release3')
        for (let i = 0; i < iterable.length; i++) {
          let node = iterable[i]
          node.style.display = 'none'
        }
        document.querySelectorAll('#freeze,#freeze2,#freeze3').map((node) => (node.style.display = 'inline'))
      }
    },

    false
  )

  document.getElementById('freeze2').addEventListener(
    'click',
    function () {
      frame3d.freeze()

      if (frame3d.frozen) {
        this.style.display = 'none'
        document.getElementById('release2').style.display = 'inline'
      }
    },

    false
  )

  document.getElementById('release2').addEventListener(
    'click',
    function () {
      frame3d.release()

      if (!frame3d.frozen) {
        this.style.display = 'none'
        document.getElementById('freeze2').style.display = 'inline'
      }
    },

    false
  )

  document.getElementById('freeze3').addEventListener(
    'click',
    function () {
      frame3d2.freeze()

      if (frame3d2.frozen) {
        this.style.display = 'none'
        document.getElementById('release3').style.display = 'inline'
      }
    },

    false
  )

  document.getElementById('release3').addEventListener(
    'click',
    function () {
      frame3d2.release()

      if (!frame3d2.frozen) {
        this.style.display = 'none'
        document.getElementById('freeze3').style.display = 'inline'
      }
    },

    false
  )

  /*
  speedTester.oncomplete (results)->
  	recommendedFps = 30
  	console.log "fps: #{results.fps}"

  	if results.fps >= recommendedFps
  		enableAll()
  	else
  		console.log("Your frame rate is too low (recommended: #{recommendedFps}fps)")

  */

  console.log('Stalling speed tester')

  return setTimeout(
    function () {
      console.log('Listening to speed tester complete event')

      return speedTester.oncomplete(function (results) {
        let recommendedFps = 30
        console.log(`fps: ${results.fps}`)

        if (results.fps >= recommendedFps) {
          enableAll()
          return document.querySelectorAll('#hide,#freeze,#freeze2,#freeze3').map((node) => (node.style.display = 'inline'))
        } else {
          return console.log(`Your frame rate is too low (recommended: ${recommendedFps}fps)`)
        }
      })
    },
    5000
  )
}
