var React = require('react')

module.exports = (component, default_values) => {
  var mapping = {}
  const defaultProps = component.defaultProps
  for (var key in component.propTypes) {
    switch (component.propTypes[key]) {
      case React.PropTypes.array:
        mapping[key] = { type: 'array', required: false }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.array.isRequired:
        mapping[key] = { type: 'array', required: true }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.bool:
        mapping[key] = { type: 'bool', required: false }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.bool.isRequired:
        mapping[key] = { type: 'bool', required: true }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.func:
        mapping[key] = { type: 'func', required: false }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.func.isRequired:
        mapping[key] = { type: 'func', required: true }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.number:
        mapping[key] = { type: 'number', required: false }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.number.isRequired:
        mapping[key] = { type: 'number', required: true }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.object:
        mapping[key] = { type: 'object', required: false }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.object.isRequired:
        mapping[key] = { type: 'object', required: true }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.string:
        mapping[key] = { type: 'string', required: false }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.string.isRequired:
        mapping[key] = { type: 'string', required: true }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.element:
        mapping[key] = { type: 'element', required: false }
        mapping[key].defaultValue = defaultProps[key]
        break
      case React.PropTypes.element.isRequired:
        mapping[key] = { type: 'element', required: true }
        mapping[key].defaultValue = defaultProps[key]
        break
      default:
        mapping[key] = 'unknown'
        mapping[key].defaultValue = 'unknown'
        break
    }
    if (default_values[key] !== undefined) {
      mapping[key].defaultValue = default_values[key]
    }
  }
  return mapping
}
