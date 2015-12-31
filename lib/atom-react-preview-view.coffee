fs                    = require 'fs'
{CompositeDisposable, Disposable} = require 'atom'
{$, $$$, ScrollView}  = require 'atom-space-pen-views'
path                  = require 'path'
os                    = require 'os'
ReactDOM = require('react-dom')
ReactDOMServer = require('react-dom/server')
React = require('react')
babel = require('babel-core')
find_component_proptypes = require('./find_component_proptypes')
renderer = require('./renderer')
window.find_component_proptypes = find_component_proptypes

module.exports =
class AtomReactPreviewView extends ScrollView
  atom.deserializers.add(this)

  editorSub           : null
  onDidChangeTitle    : -> new Disposable()
  onDidChangeModified : -> new Disposable()
  componentState : {}

  @deserialize: (state) ->
    new AtomReactPreviewView(state)

  @content: ->
    @div class: 'atom-react-preview native-key-bindings', tabindex: -1

  constructor: ({@editorId, filePath}) ->
    super

    if @editorId?
      @resolveEditor(@editorId)
      @tmpPath = @getPath() # after resolveEditor
    else
      if atom.workspace?
        @subscribeToFilePath(filePath)
      else
        atom.packages.onDidActivatePackage =>
          @subscribeToFilePath(filePath)

  serialize: ->
    deserializer : 'AtomReactPreviewView'
    filePath     : @getPath()
    editorId     : @editorId

  destroy: ->
    # @unsubscribe()
    @editorSub.dispose()

  subscribeToFilePath: (filePath) ->
    @trigger 'title-changed'
    @handleEvents()
    @renderHTML()

  resolveEditor: (editorId) ->
    resolve = =>
      @editor = @editorForId(editorId)

      if @editor?
        @trigger 'title-changed' if @editor?
        @handleEvents()
      else
        # The editor this preview was created for has been closed so close
        # this preview since a preview cannot be rendered without an editor
        atom.workspace?.paneForItem(this)?.destroyItem(this)

    if atom.workspace?
      resolve()
    else
      atom.packages.onDidActivatePackage =>
        resolve()
        @renderHTML()

  editorForId: (editorId) ->
    for editor in atom.workspace.getTextEditors()
      return editor if editor.id?.toString() is editorId.toString()
    null

  handleEvents: =>

    changeHandler = =>
      @renderHTML()
      pane = atom.workspace.paneForURI(@getURI())
      if pane? and pane isnt atom.workspace.getActivePane()
        pane.activateItem(this)

    @editorSub = new CompositeDisposable

    if @editor?
      @editorSub.add @editor.onDidSave changeHandler
      #@editorSub.add @editor.onDidStopChanging changeHandler
      @editorSub.add @editor.onDidChangePath => @trigger 'title-changed'

  renderHTML: ->
    @showLoading()
    if @editor?
      @renderHTMLCode()

  save: (callback) ->
    setTimeout(() =>
      callback()
    , 0)

  updateComponents: (new_props) ->
    @componentState = new_props
    @renderHTMLCode()

  renderHTMLCode: () ->
    path = @editor.getPath()
    delete require.cache[path]
    if not atom.config.get("atom-react-preview.triggerOnSave") and @editor.getPath()? then @save () =>
      iframe = document.createElement("iframe")
      # Fix from @kwaak (https://github.com/webBoxio/atom-html-preview/issues/1/#issxuecomment-49639162)
      # Allows for the use of relative resources (scripts, styles)
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin")

      try
        subcomponent_to_render = React.createElement(require(path), @componentState)
      catch err
        atom.notifications.addError('Error parsing React component!', {detail: 'Something went wrong rendering your component "'+@editor.getTitle()+'"\n\n\nCheck for syntax-errors.\n\n\n Full Message:\n\n\n' + err.toString(), dismissable: true})
      component_to_render = React.createElement(renderer, {
        dispatch: @updateComponents.bind(this)
        component_props: @componentState
        }, subcomponent_to_render)
      #component_to_render = React.createElement(require(path))
      html_string = ReactDOMServer.renderToString(component_to_render)
      iframe.src = "data:text/html;charset=utf-8," + html_string;
      @html $ iframe
      window.component_to_render = component_to_render
      window.React = React
      window.iframe = iframe
      iframe.onload = () =>
        ReactDOM.render(
          component_to_render,
          iframe.contentDocument.body)
      atom.commands.dispatch 'atom-react-preview', 'react-changed'

  getTitle: ->
    if @editor?
      # "#{componentName} Preview"
      "#{@editor.getTitle()} Preview"
    else
      "React Preview"

  getURI: ->
    "react-preview://editor/#{@editorId}"

  getPath: ->
    if @editor?
      @editor.getPath()

  showError: (result) ->
    failureMessage = result?.message

    @html $$$ ->
      @h2 'Previewing React Component Failed'
      @h3 failureMessage if failureMessage?

  showLoading: ->
    @html $$$ ->
      @div class: 'atom-react-spinner', 'Loading React Preview\u2026'
