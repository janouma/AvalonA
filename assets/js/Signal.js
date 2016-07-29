class Signal {

  _Ø = Object.create(null)

  register (listener) {
    if (typeof listener === 'function') {
      return (this._listeners != null ? this._listeners : (this._listeners = [])).push(listener)
    }
  }

  unregister (listener) {
    if (this._listeners) {
      let index = this._listeners.indexOf(listener)
      if (index >= 0) { return this._listeners.splice(index, 1) }
    }
  }

  clear () { this._listener = undefined }

  send (sender, data) {
    if (this._listeners) {
      return this._listeners.map((listener) => listener.call(this._Ø, sender, data))
    }
  }
}
