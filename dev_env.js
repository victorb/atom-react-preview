const component_props = {}

import React from 'react'
import ReactDOM from 'react-dom'
import SubComponent from './test'
import RootComponent from './lib/renderer.js'

const updateComponents = (new_props) => {
  const combined_props = Object.assign({}, component_props, new_props)
  render(combined_props)
}

const render = (props) => {
  const subcomponent_to_render = React.createElement(
    SubComponent,
    props
  )

  const component_to_render = React.createElement(RootComponent, {
    dispatch: updateComponents,
    component_props: props
  }, subcomponent_to_render)

  ReactDOM.render(component_to_render, document.body)
}

document.addEventListener('DOMContentLoaded', (event) => {
  render(component_props)
})
