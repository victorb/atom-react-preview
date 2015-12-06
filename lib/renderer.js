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
    const required_render = this.props.isRequired ? '*' : ''
    return <div>
      {this.props.label}{required_render}:<br/>
      <input
        type='number'
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
NumberProps.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.number.isRequired,
  isRequired: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}
class BoolProps extends Component {
  render () {
    const required_render = this.props.isRequired ? '*' : ''
    return <div>
      {this.props.label}{required_render}:<br/>
      <input
        type='checkbox'
        checked={this.props.defaultValue}
        onClick={(ev) => {
          this.props.onChange(this.props.label, ev.target.checked, true)
        }}
      ></input>
    </div>
  }
}
BoolProps.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
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
    const style = {
      padding: '10px'
    }
    return <div style={style}>
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
    }, () => {
      if (should_trigger_update) {
        this.props.dispatch(this.state)
      }
    })
  }
  render () {
    const children_props = getPropTypes(this.props.children.type, this.props.component_props)
    const render_style = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
    const title_style = {
      fontWeight: 'bolder',
      backgroundColor: 'black',
      color: 'white',
      padding: '10px'
    }
    const component_style = {
      padding: '10px'
    }
    const props_editor_style = {
      bottom: 0,
      left: 0,
      right: 0,
      height: 'auto',
      backgroundColor: 'white'
    }
    return <div style={render_style}>
      <div style={{position: 'relative'}}>
        <div style={title_style}>
          Rendered Component
        </div>
      </div>
      <div style={{position: 'relative'}}>
        <div style={component_style}>
          {this.props.children}
        </div>
      </div>
      <div style={props_editor_style}>
        <div style={title_style}>
            PropsEditor
        </div>
        <div style={{padding: '10px'}}>
          <button onClick={() => {
            this.props.dispatch(this.state)
          }}>Update Component Props</button>
          <PropsEditor props={children_props} onChange={this.handleOnChange.bind(this)}/>
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
