let dimensionPattern = /^\d+(%|px)?$/gi

let validDimension = function (dimension) {
  dimensionPattern.lastIndex = 0
  let result = dimensionPattern.test(dimension)
  dimensionPattern.lastIndex = 0
  return result
}

class ActiveArea {
  assertValid () {
    let errors = ['The following validation errors occured:']

    if (typeof this.position !== 'object') {
      if (this.position !== 'auto') { errors.push(`area.position is not valid (${this.position})`) }
    } else {
      if (this.position.x !== 'auto' && !validDimension(this.position.x)) { errors.push(`area.position.x is not valid (${this.position.x}})`) }
      if (this.position.y !== 'auto' && !validDimension(this.position.y)) { errors.push(`area.position.y is not valid (${this.position.y}})`) }
    }

    if (this.attachment !== 'fixed' && this.attachment !== 'scroll') { errors.push(`area.attachment is not valid (${this.attachment})`) }
    if (!validDimension(this.area.width)) { errors.push(`area.width is not valid (${this.area.width})`) }
    if (!validDimension(this.area.height)) { errors.push(`area.height is not valid (${this.area.height})`) }

    if (errors.length > 1) { throw new Error(errors.join('\n')) }
  }

  processActiveArea () {
    this.width = parseInt(this.area.width, 10)
    this.widthIsFluid = dimensionPattern.exec(this.area.width)[1] === '%'
    dimensionPattern.lastIndex = 0

    this.height = parseInt(this.area.height, 10)
    this.heightIsFluid = dimensionPattern.exec(this.area.height)[1] === '%'
    dimensionPattern.lastIndex = 0

    if (typeof this.position === 'object') {
      if (this.position.x !== 'auto') { this.x = parseInt(this.position.x, 10) }
      if (this.position.y !== 'auto') { this.y = parseInt(this.position.y, 10) }
    }
  }

  init (frame) {
    let xBaseComputation
    let yBaseComputation
    this.frame = frame
    if (!this.frame) { throw new Error('frame argument cannot be null') }

    this.xBase = (xBaseComputation = this.getXBaseComputation())()
    this.yBase = (yBaseComputation = this.getYBaseComputation())()

    if (this.widthIsFluid) {
      this.xMaxComputation = function () { return this.xMin + ((this.width / 100) * parseInt(window.getComputedStyle(this.frame).width, 10)) }
    } else {
      this.xMaxComputation = function () { return this.xMin + this.width }
    }

    if (this.heightIsFluid) {
      this.yMaxComputation = function () { return this.yMin + ((this.height / 100) * parseInt(window.getComputedStyle(this.frame).height, 10)) }
    } else {
      this.yMaxComputation = function () { return this.yMin + this.height }
    }

    if (this.attachment === 'fixed') {
      let scrollDebugCode
      this.xPadding = this.frame.scrollLeft
      this.yPadding = this.frame.scrollTop

      if (this.debug === true) {
        console.log('Listen to scroll event')
        scrollDebugCode = () => console.log(`Scroll : @xPadding = ${this.xPadding}, @yPadding = ${this.yPadding}`)
      } else {
        scrollDebugCode = function () {}
      }

      let windowScrollCount = 0
      window.addEventListener(
        'scroll',
        () => {
          if (++windowScrollCount % 5 > 0) { return }
          this.xPadding = window.pageXOffset
          this.yPadding = window.pageYOffset
          this.refreshBounds()
          scrollDebugCode()
        },

        false
      )

      let frameScrollCount = 0
      this.frame.addEventListener(
        'scroll',
        () => {
          if (++frameScrollCount % 5 > 0) { return }
          this.xPadding = this.frame.scrollLeft
          this.yPadding = this.frame.scrollTop
          this.refreshBounds()
          return scrollDebugCode()
        },

        false
      )
    } else {
      this.xPadding = this.yPadding = 0
    }

    let resizeDebugCode

    if (this.debug === true) {
      resizeDebugCode = () => console.log(`Resize : @frame.style.width = ${window.getComputedStyle(this.frame).width}, @frame.style.height = ${window.getComputedStyle(this.frame).height}`)
    } else {
      resizeDebugCode = function () {}
    }

    window.addEventListener(
      'resize',
      () => {
        this.xBase = xBaseComputation()
        this.yBase = yBaseComputation()
        this.refreshBounds()
        resizeDebugCode()
      },

      false
    )

    return this.refreshBounds()
  }

  refreshBounds () {
    this.xMin = this.xBase + this.xPadding
    this.xMax = this.xMaxComputation()
    this.yMin = this.yBase + this.yPadding
    this.yMax = this.yMaxComputation()
  }

  bounds () {
    return {
      xMin: this.xMin,
      xMax: this.xMax,
      yMin: this.yMin,
      yMax: this.yMax
    }
  }

  getXBaseComputation () {
    let xBaseComputation
    let frameWidth = parseInt(window.getComputedStyle(this.frame).width, 10)

    if (this.position.x && this.position.x !== 'auto') {
      if (dimensionPattern.exec(this.position.x)[1] === '%') {
        xBaseComputation = () => (this.x / 100) * frameWidth
      } else {
        xBaseComputation = () => this.x
      }

      dimensionPattern.lastIndex = 0
    } else {
      if (this.widthIsFluid) {
        xBaseComputation = () => ((50 - (this.width / 2)) / 100) * frameWidth
      } else {
        xBaseComputation = () => (frameWidth / 2) - (this.width / 2)
      }
    }

    return xBaseComputation
  }

  getYBaseComputation () {
    let yBaseComputation
    let frameHeight = parseInt(window.getComputedStyle(this.frame).height, 10)

    if (this.position.y && this.position.y !== 'auto') {
      if (dimensionPattern.exec(this.position.y)[1] === '%') {
        yBaseComputation = () => (this.y / 100) * frameHeight
      } else {
        yBaseComputation = () => this.y
      }

      dimensionPattern.lastIndex = 0
    } else {
      if (this.heightIsFluid) {
        yBaseComputation = () => ((50 - (this.height / 2)) / 100) * frameHeight
      } else {
        yBaseComputation = () => (frameHeight / 2) - (this.height / 2)
      }
    }

    return yBaseComputation
  }

  mouseover (event) { return this.xMin <= event.pageX && event.pageX <= this.xMax && this.yMin <= event.pageY && event.pageY <= this.yMax }

  constructor (area) {
    this.area = area
    if (!this.area) { throw new Error('area argument is missing') }
    this.position = this.area.position || 'auto'

    if (typeof this.position === 'object') {
      if (this.position.x == null) { this.position.x = 'auto' }
      if (this.position.y == null) { this.position.y = 'auto' }
      if (this.position.x === 'auto' && this.position.y === 'auto') { this.position = 'auto' }
    }

    this.attachment = this.area.attachment || 'fixed'
    this.assertValid()
    this.processActiveArea()
  }
}
