'use babel'
import React, { Component } from 'react'

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
  name: React.PropTypes.string,
  age: React.PropTypes.string // Only got String so far...
}
Name.defaultProps = {
  name: 'Victor',
  age: '18'
}
