class Transformer {
  static CSS_BACKUP_ATTRIBUTE = 'data-css-backup'
  static TRANSITION_DURATION = 0.75
  _static = this

  constructor (params) {
    ({
      from: this._from,
      isRoot: this._isRoot,
      transformAttribute: this._transformAttribute,
      debug: this._debug
    } = params)

    if (!this._from) { throw Error('[Transformer] - constructor - from argument must be defined') }
    if (!this._transformAttribute) { throw Error('[Transformer] - constructor - transformAttribute argument must be defined') }
    if (this._isRoot == null) { throw Error('[Transformer] - constructor - isRoot argument must be defined') }

    this.on = { complete: new Signal() }
  }

  applyTransform () {
    this._calcTransformsCount()
    return this._applyTransform(this._from, this._isRoot)
  }

  _calcTransformsCount () {
    let transformAttribute = this._transformAttribute
    let from = this._from
    this._transformsCount = from.querySelectorAll(`[${transformAttribute}]`).length
    if (from.getAttribute(transformAttribute)) { return this._transformsCount++ }
  }

  _applyTransform (from, isRoot = false) {
    let layers = this._layers = { all: [] }
    let transformAttribute = this._transformAttribute

    this._applyOn(from)

    if (this._debug === true) {
      let debugNode = from.firstElementChild
      if (debugNode) { console.log(`[Transformer] - refreshTransform - firstChild: ${DomUtil.getDebugName(debugNode)}`) }
    }

    for (let i = 0; i < from.children.length; i++) {
      let child = from.children[i]
      let subLayers = this._refreshChildTransform(child)
      if (subLayers) { layers.all.push(...subLayers) }
    }

    if (!isRoot && from.getAttribute(transformAttribute)) {
      layers.root = new Layer(from, transformAttribute)
      layers.all.push(layers.root)
    }

    if (isRoot) {
      for (let j = 0; j < layers.all.length; j++) {
        let layer = layers.all[j]
        if (layer.id) { layers[`#${layer.id}`] = layer }

        if (!layer.registered) {
          layer.registered = true

          layer.on.refresh.register((layer) => {
            let transformer = new Transformer({
              from: layer.node,
              isRoot: false,
              transformAttribute,
              debug: this._debug
            })

            transformer.on.complete.register((sender, data) => this.on.complete.send(sender, data))
            return transformer.applyTransform()
          }
          )
        }

        if (layer.classes) {
          for (let k = 0; k < layer.classes.length; k++) {
            let cssClass = layer.classes[k]
            let classSelector = `.${cssClass}`
            if (layers[classSelector] == null) { layers[classSelector] = [] }
            layers[classSelector].push(layer)
          }
        }
      }
    }

    return layers
  }

  _refreshChildTransform (child) {
    if (!child) { throw Error('[Transformer] - _refreshChildTransform - child argument cannot be null') }

    let transformAttribute = this._transformAttribute

    if (child.querySelectorAll(`[${transformAttribute}]`).length) {
      if (this._debug === true) { console.log(`[Transformer] - _refreshChildTransform - child ${DomUtil.getDebugName(child)} has children`) }
      return this._applyTransform(child).all
    } else if (child.getAttribute(transformAttribute)) {
      if (this._debug === true) { console.log(`[Transformer] - _refreshChildTransform - child ${DomUtil.getDebugName(child)} has '${transformAttribute}'`) }
      this._applyOn(child)
    }

    if (child.getAttribute(transformAttribute)) { return [new Layer(child, transformAttribute)] }
  }

  _applyOn (target) {
    let attrValue
    if (!target) { throw Error('[Transformer] - _applyOn - target argument cannot be null') }

    let transformAttribute = this._transformAttribute

    this._backup(target)

    _TweenLite.set(
      target, {
        css: {
          transformStyle: 'preserve-3d',
          overflow: 'visible'
        }
      }
    )

    attrValue = target.getAttribute(transformAttribute)

    if (attrValue) {
      let transforms = {}

      let iterable = attrValue.split(';')
      for (let i = 0; i < iterable.length; i++) {
        let t = iterable[i]
        if (t.trim()) {
          let [prop, value] = t.split(':')
          transforms[prop.trim()] = parseFloat(value.trim(), 10)
        }
      }

      let { x, y, z, rx, ry, rz, ox, oy, oz } = transforms

      if (x || y || z || rx || ry || rz || ox || oy || oz) {
        let css = {}
        if (x) { css.x = x }
        if (y) { css.y = y }
        if (z) { css.z = z }
        if (rx) { css.rotationX = rx }
        if (ry) { css.rotationY = ry }
        if (rz) { css.rotationZ = rz }

        let transformOrigin = []
        let iterable1 = [oz, oy, ox]
        for (let j = 0; j < iterable1.length; j++) {
          let o = iterable1[j]
          if ((o != null) || transformOrigin.length > 0) {
            transformOrigin.unshift(`${100 * ((o != null) ? o : 0.5)}%`)
          }
        }

        if (transformOrigin.length > 0) { css.transformOrigin = transformOrigin.join(' ') }

        return _TweenLite.to(
          target,
          this._static.TRANSITION_DURATION,
          { css }
        ).eventCallback('onComplete', ::this._onTweenComplete)
      }
    }
  }

  _backup (target) {
    if (!target.getAttribute(this._static.CSS_BACKUP_ATTRIBUTE)) {
      let targetStyle = window.getComputedStyle(target)

      let backup = {
        transformStyle: DomUtil.getTransformStyle(targetStyle) || 'flat',
        overflow: targetStyle.overflow || 'inherit'
      }

      let transformBackup = DomUtil.getTransform(targetStyle)
      if (transformBackup) { backup.transform = transformBackup }

      return target.setAttribute(Transformer.CSS_BACKUP_ATTRIBUTE, JSON.stringify(backup))
    }
  }

  _onTweenComplete () {
    if (this._debug === true) { console.log(`[Transformer] - _onTweenComplete - @_transformsCount: ${this._transformsCount}`) }
    if (--this._transformsCount === 0) { return this.on.complete.send(this._from, this._isRoot) }
  }
}
