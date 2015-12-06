'use babel'
import React, { Component, PropTypes } from 'react'

export default class Name extends Component {
  render () {
    const style = {
      color: 'white',
      backgroundColor: 'black',
      padding: '50px'
    }
    const shared_style = {
      margin: '10px',
      color: '#9f9'
    }
    let warning = null
    if (this.props.show_warning) {
      const warning_style = {
        padding: '10px',
        color: '#f99'
      }
      warning = <div style={warning_style}>WARNING! Content here might or might not be true...</div>
    }
    return <div style={style}>
      {warning}
      <div style={shared_style}>
        Hello, {this.props.name}
      </div>
      <div style={shared_style}>
        You are {this.props.age} years old.
      </div>
      <div style={shared_style}>
        You have {this.props.pets.length} pet...
      </div>
      <div style={shared_style}>
        Is it true that you are tired? {this.props.is_tired.toString()}
      </div>
    </div>
  }
}
Name.propTypes = {
  name: PropTypes.string,
  pets: PropTypes.array,
  age: PropTypes.number,
  is_tired: PropTypes.bool,
  show_warning: PropTypes.bool
}
Name.defaultProps = {
  name: 'Victor',
  pets: ['Gaia'],
  age: 18,
  is_tired: false,
  show_warning: false
}
