/* SpeedTester 0.9.0 */
if (typeof console !== 'undefined' && console !== null) { console.log('%cSpeedTester 0.9.0', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;') }

let defineSpeedTester = function (global) {
  let Ø = (Object.create && Object.create(null)) || {}
  let second = 1000

  class SpeedTester {

    constructor (times) {
      this._frame = this._frame.bind(this)
      this.frameCount = 0
      this.times = (times && Math.abs(Math.ceil(times))) || 1
    }

    run () {
      let requestAnimationFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame || global.webkitRequestAnimationFrame || global.oRequestAnimationFrame

      this._testResults = {}
      this._complete = false

      if (requestAnimationFrame) {
        requestAnimationFrame(this._frame)
      } else {
        if (typeof console !== 'undefined' && console !== null) { console.warn('Your browser doesn\'t support "requestAnimationFrame"') }
        this._triggerComplete()
      }
      return this
    }

    _triggerComplete () {
      this._testResults = {fps: this.frameCount / this.times}
      this._complete = true
      return this._oncomplete && this._oncomplete.call(Ø, this._testResults)
    }

    _frame (tick) {
      this.frameCount++
      if (!this.start) { this.start = tick }

      if (tick - this.start < (second * this.times)) {
        return window.requestAnimationFrame(this._frame)
      } else { return this._triggerComplete() }
    }

    oncomplete (_oncomplete) {
      this._oncomplete = _oncomplete
      return this._complete && this._oncomplete.call(Ø, this._testResults)
    }
  }

  // ======================================== Public API =============================================
  return SpeedTester
}

/* Export */

if (typeof define === 'function' && define.amd) {
  define('SpeedTester', [], () => defineSpeedTester(this))
} else {
  window.SpeedTester = defineSpeedTester(this)
}
