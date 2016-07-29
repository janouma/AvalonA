let DomUtil = {
  getTransformStyle (style) {
    return style.getPropertyValue('-webkit-transform-style') ||
      style.getPropertyValue('-moz-transform-style') ||
      style.getPropertyValue('-ms-transform-style') ||
      style.getPropertyValue('transform-style')
  },

  getTransform (style) {
    return style.getPropertyValue('-webkit-transform') ||
      style.getPropertyValue('-moz-transform') ||
      style.getPropertyValue('-o-transform') ||
      style.getPropertyValue('-ms-transform') ||
      style.getPropertyValue('transform')
  },

  getDebugName (node) {
    return `${node.tagName}(${node.id ||
		node.getAttribute('class') ||
		node.getAttribute('href')})`
  }
}
