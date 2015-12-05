'use babel'

import React, { Component, PropTypes } from 'react'
import getPropTypes from './find_component_proptypes'

class StringProps extends Component {
  render () {
    const required_render = this.props.isRequired ? '*' : ''
    return <div>
      {this.props.label}{required_render}:<br/>
      <input
        type='text'
        defaultValue={this.props.defaultValue}
        onChange={(ev) => {
          this.props.onChange(this.props.label, ev.target.value)
        }}
        onKeyUp={(ev) => {
          if (ev.keyCode === 13) {
            this.props.onChange(this.props.label, ev.target.value, true)
          }
        }}
      ></input>
    </div>
  }
}
StringProps.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}
class ArrayProps extends Component {
  render () {
    return <div>Array here (Coming soon!)</div>
  }
}
class NumberProps extends Component {
  render () {
    return <div>Number here (Coming soon!)</div>
  }
}
class BoolProps extends Component {
  render () {
    return <div>Bool here (Coming soon!)</div>
  }
}

const props_map = {
  'string': StringProps,
  'array': ArrayProps,
  'number': NumberProps,
  'bool': BoolProps
}

class PropsEditor extends Component {
  render () {
    const props_to_edit = Object.keys(this.props.props).map((key) => {
      const defVal = this.props.props[key].defaultValue
      const required = this.props.props[key].required
      const type = this.props.props[key].type
      const type_props = props_map[type]
      return React.createElement(type_props, {
        label: key,
        isRequired: required,
        defaultValue: defVal,
        onChange: this.props.onChange
      })
    })
    return <div>
      PropsEditor:<br/>
      {props_to_edit}
    </div>
  }
}
PropsEditor.propTypes = {
  props: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default class Renderer extends Component {
  constructor (props) {
    super(props)
    this.state = this.props.component_props
  }
  handleOnChange (label, value, should_trigger_update) {
    this.setState({
      [label]: value
    })
    if (should_trigger_update) {
      this.props.dispatch(this.state)
    }
  }
  render () {
    const children_props = getPropTypes(this.props.children.type, this.props.component_props)
    return <div>
      <div>
        Component to render:
      </div>
      <div>{this.props.children}</div>
      <div>
        <PropsEditor props={children_props} onChange={this.handleOnChange.bind(this)}/>
        <div>
          <button onClick={() => {
            this.props.dispatch(this.state)
          }}>Update Component Props</button>
        </div>
      </div>
    </div>
  }
}
Renderer.propTypes = {
  children: PropTypes.element,
  dispatch: PropTypes.func.isRequired,
  component_props: PropTypes.object
}
