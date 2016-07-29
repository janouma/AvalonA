// @codekit-prepend 'utils/DomUtil'
// @codekit-prepend 'ActiveArea'
// @codekit-prepend 'Signal'
// @codekit-prepend 'Layer'
// @codekit-prepend 'Transformer'
// ================================================================================================

/* AvalonA 1.2.0 */
console.log('%cAvalonA 1.2.0', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;')

let _TweenLite

let noeffect = (rotation) => rotation
let transformStyleIsSupported

let detectTransformStyleSupport = function () {
  if (transformStyleIsSupported === undefined) {
    let element = document.createElement('b')
    element.id = 'avalona-detection-element'
    element.style.position = 'absolute'
    element.style.top = 0
    element.style.left = 0

    document.body.appendChild(element)

    element.style.webkitTransformStyle = 'preserve-3d'
    element.style.MozTransformStyle = 'preserve-3d'
    element.style.msTransformStyle = 'preserve-3d'
    element.style.transformStyle = 'preserve-3d'

    transformStyleIsSupported = DomUtil.getTransformStyle(window.getComputedStyle(element)) === 'preserve-3d'
    document.body.removeChild(element)
  }

  return transformStyleIsSupported
}

let defineAvalonA = function () {
  class Frame3d {

    get onstart () {
      return this.onenable
    }

    set onstart (onstart) {
      this.onenable = onstart
    }

    find3dFrames () {
      this.frame = document.getElementById(this.frameId)
      this.transformedLayer = this.frame.querySelector(`#${this.layerId}`)

      if (this.debug === true) {
        console.log(`@transformAttribute: ${this.transformAttribute}`)
        console.log(`@layerId: ${this.layerId}`)
      }

      if (!this.frame) { throw new Error(`Cannot find 3d frame '#${this.frameId}' in dom`) }
      if (!this.transformedLayer) { throw new Error(`Cannot find 3d inner frame '#${this.frameId} > #${this.layerId}' in dom`) }
    }

    addPerspective () {
      return _TweenLite.set(
        this.transformedLayer,
        {
          css: {
            perspective: 1000
          }
        }
      )
    }

    removePerspective () {
      return _TweenLite.set(
        this.transformedLayer,
        {
          css: {
            perspective: 'none'
          }
        }
      )
    }

    trackMouseMovements () {
      if (this.debug === true && this.activeArea) {
        let iterable
        let activeAreaPlaceholderId = 'avalona-active-area'
        let activeAreaPlaceholder = document.getElementById(activeAreaPlaceholderId) || document.createElement('div')
        activeAreaPlaceholder.textContent = 'AvalonA Active Area'
        activeAreaPlaceholder.id = activeAreaPlaceholderId

        for (let rule in (iterable = {
          'background-color': 'hotpink',
          'opacity': 0.5,
          'pointer-events': 'none',
          'position': 'absolute',
          'visibility': 'hidden',
          'z-index': 10000
        })) {
          let value = iterable[rule]
          activeAreaPlaceholder.style.setProperty(rule, value)
        }

        document.body.appendChild(activeAreaPlaceholder)

        this.debugMouseMove = function () {
          let iterable1
          console.log(`rotationX: ${this.rotationX}, rotationY: ${this.rotationY}`)

          let bounds = this.activeArea.bounds()

          for (let rule in (iterable1 = {
            visibility: 'visible',
            left: `${bounds.xMin}px`,
            top: `${bounds.yMin}px`,
            width: `${bounds.xMax - bounds.xMin}px`,
            height: `${bounds.yMax - bounds.yMin}px`
          })) {
            let value = iterable1[rule]
            activeAreaPlaceholder.style.setProperty(rule, value)
          }
        }
      } else {
        this.debugMouseMove = function () { }
      }

      if (this.activeArea) {
        this.activeArea.init(this.frame)
      } else {
        this.frame.addEventListener(
          'mouseleave',
          function (e) { if (e.target.id === this.frameId) { return this.mouseout() } },
          false
        )
      }

      return this.frame.addEventListener('mousemove', this.mousemove, false)
    }

    mouseout () { return this.disableRotation() }

    mouseMoveCount = 0

    mousemove (event) {
      if (++this.mouseMoveCount % 5 > 0) { return }
      if (!this.activeArea || this.activeArea.mouseover(event)) {
        this.onrotation()
        this.rotationY = (event.pageX - (window.innerWidth / 2)) / 25
        this.rotationX = (-1 * (event.pageY - (window.innerHeight / 2))) / 15

        this.debugMouseMove()

        return _TweenLite.to(
          this.transformedLayer,
          0.1, {
            css: {
              rotationX: this.fy(this.rotationX),
              rotationY: this.fx(this.rotationY)
            }
          }
        )
      } else { return this.disableRotation() }
    }

    onrotation () {
      clearTimeout(this.rotationTimeoutId)

      if (!this.rotating) {
        __guard__(this.animation, (x) => x.pause())
        __guardFunc__(this.onstartrotation, (f) => f())
        this.rotating = true
      }

      if (this.idleTimeout > 0) {
        this.rotationTimeoutId = setTimeout(
          this.stopRotation,
          this.idleTimeout
        )
      }
    }

    stopRotation () {
      clearTimeout(this.rotationTimeoutId)
      if (this.rotating) {
        this.rotating = false
        __guardFunc__(this.onendrotation, (f) => f())
        return __guard__(this.animation, (x) => x.play())
      }
    }

    disableRotation (duration = 1) {
      if ((this.rotationX || this.rotationY) && (this.animation == null)) { this.resetRotation(duration) }
      return this.stopRotation()
    }

    resetRotation (duration = 1) {
      clearTimeout(this.rotationTimeoutId)
      this.rotationX = this.rotationY = 0
      return _TweenLite.to(
        this.transformedLayer,
        duration, {
          css: {
            rotationX: 0,
            rotationY: 0
          }
        }
      )
    }

    resetTransform () {
      let iterable
      clearTimeout(this.rotationTimeoutId)
      this.rotationX = this.rotationY = 0

      for (let rule in (iterable = {
        '-webkit-transform': 'none',
        '-moz-transform': 'none',
        '-o-transform': 'none',
        '-ms-transform': 'none',
        'transform': 'none'
      })) {
        let value = iterable[rule]
        this.transformedLayer.style.setProperty(rule, value)
      }
    }

    untrackMouseMovements () {
      __guard__(this.frame, (x) => x.removeEventListener('mousemove', this.mousemove))
      return __guard__(this.frame, (x1) => x1.removeEventListener('mouseleave', this.mouseout))
    }

    refreshTransform (root) {
      if (this.disabled === true) { return }

      if (typeof root === 'string') { root = root.trim() }
      let fromRoot = !root || root === this.transformedLayer

      if (typeof root === 'undefined' || root === null) { root = this.transformedLayer }
      let rootNode = typeof root === 'string' ? this.transformedLayer.querySelector(root) : root

      if (this.debug === true) { console.log(`rootNode: ${DomUtil.getDebugName(rootNode)}`) }

      let transformer = new Transformer({
        from: rootNode,
        isRoot: fromRoot,
        transformAttribute: this.transformAttribute,
        debug: this.debug
      })

      transformer.on.complete.register((sender, isRoot) => {
        return __guardFunc__(this.onrefresh, (f) => f(sender, isRoot))
      })

      transformer.on.complete.register((sender, isRoot) => {
        if (isRoot && !this._enableTriggered) {
          this._enableTriggered = true
          return __guardFunc__(this.onenable, (f) => f(sender, isRoot))
        }
      })

      let layers = transformer.applyTransform()

      if (fromRoot) { this.layers = layers }

      return layers
    }

    refresh () {
      if (this.disabled === true) { return }

      if (this.frame) {
        this.untrackMouseMovements()
        __guard__(this.animation, (x) => x.pause())
      }

      this.find3dFrames()
      this.addPerspective()
      let layers = this.refreshTransform()

      if (!this.frozen) {
        this.trackMouseMovements()
        __guard__(this.animation, (x1) => x1.play(this.transformedLayer, this.transformAttribute))
      }

      return layers
    }

    start () { return this.enable() }

    enable () {
      if (this.disabled === false) { return }

      this.disabled = false
      this._enableTriggered = false

      if (!this.ready) {
        try {
          __guardFunc__(this.onready, (f) => f())
        } catch (error) {
          console.error('[AvalonA] - enable - Error occured on ready', error)
        }

        this.ready = true
      }

      return this.refresh()
    }

    disable () {
      if (this.disabled === true) { return }

      if (this.frame) {
        this.untrackMouseMovements()
        this.disableRotationEvent()
        __guard__(this.animation, (x) => x.pause())
        this.flatten()
        this.removePerspective()
      }

      this.disabled = true
    }

    disableRotationEvent () {
      clearTimeout(this.rotationTimeoutId)
      if (this.rotating) {
        this.rotating = false
        return __guardFunc__(this.onendrotation, (f) => f())
      }
    }

    flatten () {
      this.resetTransform()

      let iterable = this.transformedLayer.querySelectorAll(`[${Transformer.CSS_BACKUP_ATTRIBUTE}]`)
      for (let i = 0; i < iterable.length; i++) {
        let node = iterable[i]
        if (this.debug === true) { console.log(`flattening layer '${DomUtil.getDebugName(node)}'`) }
        let css = JSON.parse(node.getAttribute(Transformer.CSS_BACKUP_ATTRIBUTE))
        _TweenLite.set(node, { css })
      }
    }

    freeze () {
      if (this.disabled === true || this.frozen === true || !this.frame) { return }

      this.untrackMouseMovements()
      this.disableRotationEvent()
      __guard__(this.animation, (x) => x.pause())
      this.frozen = true
    }

    release () {
      if (this.disabled === true || this.frozen === false || !this.frame) { return }

      this.trackMouseMovements()
      __guard__(this.animation, (x) => x.play(this.transformedLayer, this.transformAttribute))
      this.frozen = false
    }

    init (options) {
      this.transformAttribute = options.tAttr || 'data-avalonA-transform'
      this.fx = typeof options.fx === 'function' ? options.fx : noeffect
      this.fy = typeof options.fy === 'function' ? options.fy : noeffect
      if (options.activeArea) { this.activeArea = new ActiveArea(options.activeArea) }
      __guard__(this.activeArea, (x) => (x.debug = this.debug))

      if (options.on) {
        ({
          startrotation: this.onstartrotation,
          endrotation: this.onendrotation,
          ready: this.onready,
          refresh: this.onrefresh,
          enable: this.onenable
        } = options.on)
      }

      this.animation = options.animation
      this.idleTimeout = parseInt(options.idleTimeout || 1000, 10)

      if (this.animation) { this.assertAnimatorValid() }
    }

    assertAnimatorValid () {
      if (!this.animation.play || typeof this.animation.play !== 'function') { throw new Error('animation.play must be a function') }
      if (!this.animation.pause || typeof this.animation.pause !== 'function') { throw new Error('animation.pause must be a function') }
    }

    constructor (frameId, layerId, options = {}) {
      this.mouseout = this.mouseout.bind(this)
      this.mousemove = this.mousemove.bind(this)
      this.stopRotation = this.stopRotation.bind(this)
      this.frameId = frameId
      this.layerId = layerId
      if (!this.frameId) { throw new Error('frameId argument cannot be null') }
      if (!this.layerId) { throw new Error('layerId argument cannot be null') }
      this.debug = options.debug
      detectTransformStyleSupport()
      if (this.debug === true) { console.log(`transformStyleIsSupported: ${transformStyleIsSupported}`) }

      if (transformStyleIsSupported) {
        this.init(options)
      } else {
        this.flatten =
          this.disableRotationEvent =
          this.disable =
          this.start =
          this.enable =
          this.refresh =
          this.applyTransformOn =
          this.refreshChildTransform =
          this.refreshTransform =
          this.untrackMouseMovements =
          this.trackMouseMovements =
          this.addPerspective =
          this.removePerspective = function () { }
      }
    }
  }

  // ======================================== Public API =============================================
  return (frameId, layerId, options) => new Frame3d(frameId, layerId, options)
}

/* Export */

if (typeof define === 'function' && define.amd) {
  define('AvalonA', ['tweenlite'], function (tweenlite) {
    _TweenLite = tweenlite
    return defineAvalonA()
  })
} else {
  _TweenLite = __guard__(window.GreenSockGlobals, (x) => x.TweenLite) || TweenLite
  window.AvalonA = defineAvalonA()
}

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
function __guardFunc__ (func, transform) {
  return typeof func === 'function' ? transform(func) : undefined
}
