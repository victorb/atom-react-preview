/* global __COMPONENT_TO_RENDER */
// This guy is responsible for settings up the application renderer with the props
import ReactDOM from 'react-dom'
import React from 'react'

import Renderer from './renderer'

var ComponentToRender = require(__COMPONENT_TO_RENDER)

if (ComponentToRender.default !== undefined) {
  ComponentToRender = ComponentToRender.default
}

const render = (props) => {
  ReactDOM.render(<Renderer
    component_props={props}
    dispatch={(new_props) => {
      render(new_props)
    }}
    component={ComponentToRender}
  />, document.getElementById('root'))
}

document.addEventListener('DOMContentLoaded', () => {
  render({})
})
