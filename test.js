'use babel'
import React, { Component, PropTypes } from 'react'

export default class Name extends Component {
  render () {
    const style = {
      color: 'white',
      backgroundColor: 'black',
      padding: '50px'
    }
    return <div style={style}>
      <div>
        Hello, {this.props.name}
      </div>
      <div>
        You are {this.props.age} years old.
      </div>
    </div>
  }
}
Name.propTypes = {
  name: PropTypes.string,
  kids: PropTypes.array,
  age: PropTypes.number,
  is_tired: PropTypes.bool
}
Name.defaultProps = {
  name: 'Victor',
  pets: ['Gaia'],
  age: 18,
  is_tired: false
}
