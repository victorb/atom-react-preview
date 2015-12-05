url                   = require 'url'
{CompositeDisposable} = require 'atom'

ReactPreviewView       = require './atom-react-preview-view'

module.exports =
  config:
    triggerOnSave:
      type        : 'boolean'
      description : 'Watch will trigger on save.'
      default     : false

  reactPreviewView: null

  activate: (state) ->
    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-react-preview:toggle': => @toggle()

    atom.workspace.addOpener (uriToOpen) ->
      try
        {protocol, host, pathname} = url.parse(uriToOpen)
      catch error
        return

      return unless protocol is 'react-preview:'

      try
        pathname = decodeURI(pathname) if pathname
      catch error
        return

      if host is 'editor'
        new ReactPreviewView(editorId: pathname.substring(1))
      else
        new ReactPreviewView(filePath: pathname)

  toggle: ->
    editor = atom.workspace.getActiveTextEditor()
    return unless editor?

    uri = "react-preview://editor/#{editor.id}"

    previewPane = atom.workspace.paneForURI(uri)
    if previewPane
      previewPane.destroyItem(previewPane.itemForURI(uri))
      return

    previousActivePane = atom.workspace.getActivePane()
    atom.workspace.open(uri, split: 'right', searchAllPanes: true).done (reactPreviewView) ->
      if reactPreviewView instanceof ReactPreviewView
        reactPreviewView.renderHTML()
        previousActivePane.activate()

  deactivate: ->
    @subscriptions.dispose()
