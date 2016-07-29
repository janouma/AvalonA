const PROPERTIES = Object.freeze(['x', 'y', 'z', 'rx', 'ry', 'rz', 'ox', 'oy', 'oz'])

class Layer {
  constructor (node, _transformAttribute) {
    this.node = node
    this._transformAttribute = _transformAttribute
    if (this.node.id) {
      this.id = this.node.id
    }

    if (this.node.className) {
      this.classes = this.node.className.split(/\s+/g)
    }

    this.on = {refresh: new Signal()}
  }

  refresh () { return this.on.refresh.send(this) }

  transform (properties) {
    for (let property of Object.keys(properties)){
      if (PROPERTIES.indexOf(property) > -1) {
        this[property] = properties[property]
      }
    }
  }
}

for (let property of PROPERTIES) {
  let propertyPattern = new RegExp(`\\b${property}\\s*:\\s*(-?\\d+(\\.\\d+)?)\\b`)

  Object.defineProperty(
    Layer.prototype,
    property,
    {
      get () {
        let transforms = this.node.getAttribute(this._transformAttribute)
        let value = parseFloat(__guard__(propertyPattern.exec(transforms), (x) => x[1].trim()), 10)

        if (isNaN(value)) {
          if (property[0] !== 'o') { return 0 } else { return 0.5 }
        } else {
          return value
        }
      },

      set (value) {
        let numericValue = parseFloat(value, 10)
        let newTransforms

        if (isNaN(numericValue)) {
          throw Error(`[Layer] - set ${property} - value (${value}) is not valid`)
        }

        let transforms = (this.node.getAttribute(this._transformAttribute)).trim()

        if (propertyPattern.test(transforms)) {
          newTransforms = transforms.replace(propertyPattern, `${property}:${numericValue}`)
        } else {
          newTransforms = `${property}:${numericValue}`
          if (transforms) { newTransforms = `${transforms}; ${newTransforms}` }
        }

        return this.node.setAttribute(this._transformAttribute, newTransforms)
      }
    }
  )
}

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
