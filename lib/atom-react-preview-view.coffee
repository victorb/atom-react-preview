# TODO Fix this file to be A LOT simpler. There is things here that should be nowhere really
fs = require 'fs'
fse = require 'fs-extra'
{CompositeDisposable, Disposable} = require 'atom'
{$, $$$, ScrollView} = require 'atom-space-pen-views'
path = require 'path'
os = require 'os'
child_process = require 'child_process'
spawn = child_process.spawn

did_bootstrap = false

module.exports =
class AtomReactPreviewView extends ScrollView
  atom.deserializers.add(this)

  editorSub           : null
  onDidChangeTitle    : -> new Disposable()
  # onDidChangeModified : -> new Disposable()
  componentState : {}
  webpackProcess: null

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
    @editorSub.dispose()
    @webpackProcess.kill 'SIGQUIT'
    did_bootstrap = false

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

    @editorSub = new CompositeDisposable

    if @editor?
      @editorSub.add @editor.onDidChangePath => @trigger 'title-changed'

  renderHTML: ->
    @showLoading()
    if @editor?
      @renderHTMLCode()

  updateComponents: (new_props) ->
    @componentState = new_props
    @renderHTMLCode()

  renderHTMLCode: () ->
    path = @editor.getPath()
    @webpackProcess = spawn('node', ['dev-server.js', path])
    @webpackProcess.on('close', (code) =>
      console.log('webpack child process exited with code ' + code)
    )
    @webpackProcess.stdout.on('data', (data) =>
      # console.log(data.toString())
      if data.toString().indexOf('bundle is now VALID.') != -1
        if did_bootstrap is false
          did_bootstrap = true
          iframe = document.createElement("iframe")
          iframe.setAttribute("src", "http://localhost:3000")
          @html $ iframe
    )

  getTitle: ->
    if @editor?
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
