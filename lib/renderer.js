// Here be dragons
// This file contains logic for the PropEditor and the Renderer itself
// TODO split this into many smaller files and refactor a bit.
import React, { Component, PropTypes } from 'react'
import getPropTypes from './find_component_proptypes'

const prop_style = {
  padding: '5px',
  backgroundColor: '#343d46',
  margin: '5px',
  width: '130px',
  color: 'white',
  fontFamily: 'Georgia',
  float: 'left',
  borderLeft: '5px solid #e67e22'
}

const prop_type_style = {
  marginTop: '5px',
  opacity: '0.7'
}

class StringProps extends Component {
  render () {
    const required_render = this.props.isRequired ? '*' : ''
    return <div style={prop_style}>
      {this.props.label}{required_render}<br/>
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
    <div style={prop_type_style}>(string)</div>
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
    const required_render = this.props.isRequired ? '*' : ''
    return <div style={prop_style}>
      {this.props.label}{required_render}<br/>
      <input
        type='text'
        defaultValue={JSON.stringify(this.props.defaultValue)}
        onChange={(ev) => {
          try {
            this.props.onChange(this.props.label, JSON.parse(ev.target.value))
          } catch (err) {
            console.log('Couldnt parse ev.target.value')
          }
        }}
        onKeyUp={(ev) => {
          if (ev.keyCode === 13) {
            try {
              this.props.onChange(this.props.label, JSON.parse(ev.target.value), true)
            } catch (err) {
              console.log('Couldnt parse ev.target.value')
            }
          }
        }}
      ></input>
    <div style={prop_type_style}>(array)</div>
    </div>
  }
}
ArrayProps.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.array.isRequired,
  isRequired: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}
class NumberProps extends Component {
  render () {
    const required_render = this.props.isRequired ? '*' : ''
    return <div style={prop_style}>
      {this.props.label}{required_render}<br/>
      <input
        type='number'
        defaultValue={this.props.defaultValue}
        onChange={(ev) => {
          this.props.onChange(this.props.label, parseInt(ev.target.value, 10))
        }}
        onKeyUp={(ev) => {
          if (ev.keyCode === 13) {
            this.props.onChange(this.props.label, parseInt(ev.target.value, 10), true)
          }
        }}
      ></input>
    <div style={prop_type_style}>(integer)</div>
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
    return <div style={prop_style}>
      {this.props.label}{required_render}<br/>
      <input
        type='checkbox'
        checked={this.props.defaultValue}
        onClick={(ev) => {
          this.props.onChange(this.props.label, ev.target.checked, true)
        }}
      ></input>
    <div style={prop_type_style}>(boolean)</div>
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
        key: key,
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
    this.state.hovering_button = false
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
  handleOnHover () {
    this.setState({
      hovering_button: !this.state.hovering_button
    })
  }
  render () {
    const component_to_render = React.createElement(this.props.component, this.props.component_props)
    const children_props = getPropTypes(component_to_render.type, this.props.component_props)
    const render_style = {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: 'hidden'
    }
    const title_style = {
      fontFamily: 'Verdana',
      backgroundColor: '#343D46',
      color: 'white',
      padding: '10px',
      position: 'fixed',
      zIndex: '100',
      borderLeft: '10px solid #A3BE8C',
      width: '100%'
    }
    const component_style = {
      padding: '10px',
      maxHeight: '54vh',
      overflowY: 'scroll'
    }
    const props_editor_style = {
      bottom: 0,
      left: 0,
      height: '200px',
      overflowY: 'scroll',
      position: 'absolute',
      right: 0,
      backgroundColor: 'white'
    }
    const right_title_style = {
      float: 'right',
      marginRight: '50px'
    }

    const hovering = this.state.hovering_button
    const button_style = {
      border: 'none',
      backgroundColor: hovering ? '#2ecc71' : 'transparent',
      padding: '5px',
      color: 'white',
      fontFamily: 'Verdana',
      textDecoration: 'underline',
      cursor: 'pointer',
      lineHeight: '15px'
    }

    const ren_comp_title_style = Object.assign({},
      title_style, { position: 'relative' })

    return <div style={render_style}>
      <div style={{position: 'relative'}}>
        <div style={ren_comp_title_style}>
          Rendered Component
        </div>
      </div>
      <div style={{position: 'relative'}}>
        <div style={component_style}>
          {component_to_render}
        </div>
      </div>
      <div style={props_editor_style}>
        <div style={title_style}>
            <span style={{
              lineHeight: '15px',
              margin: '5px'
            }}>
              Props Editor
            </span>
            <div style={right_title_style}>
              <button onClick={() => {
                this.props.dispatch(this.state)
              }}
              style={button_style}
              title='You can also press ENTER in one of the prop-editors'
              onMouseEnter={this.handleOnHover.bind(this)}
              onMouseLeave={this.handleOnHover.bind(this)}
              >Update Component Props</button>
            </div>
        </div>
        <div style={{paddingTop: '50px'}}>
          <PropsEditor props={children_props} onChange={this.handleOnChange.bind(this)}/>
        </div>
      </div>
    </div>
  }
}
Renderer.propTypes = {
  component: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  component_props: PropTypes.object.isRequired
}
