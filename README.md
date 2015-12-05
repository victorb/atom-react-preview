# Atom React Preview

A previewing tool for React Components. Works best for stateless components.

![Atom React Preview](http://i.imgur.com/wmR7IGm.gif)

## Features:

* Reload your component on save
* Editing the props in the preview area
* Saving the edits for when you save your component

Like hot reloading, but within Atom!

## Known issues:

* If you import other things in top of your component, like LESS/SASS styles, it'll break ([Issue #1](https://github.com/VictorBjelkholm/atom-react-preview/issues/1))
* You need to specify `'use babel'` in the top of the file ([Issue #2](https://github.com/VictorBjelkholm/atom-react-preview/issues/2))
* Doesn't load correctly when reloading window (opening/closing the panel solves this problem) ([Issue #3](https://github.com/VictorBjelkholm/atom-react-preview/issues/3))
* The codebase is a mess, based on atom-html-preview and only got time for minor refactoring atm, will get to that ([Issue #4](https://github.com/VictorBjelkholm/atom-react-preview/issues/4))

## Install:

### apm

```bash
apm install atom-react-preview
```

### Inside Atom:

Go to "Install Packages" and search for atom-react-preview

## Toggle React Preview ##

Press `CTRL-SHIFT-M` in the editor to open the preview pane.

## Thanks

Thanks to https://github.com/webBoxio/atom-html-preview which 90% of the code is coming from. It got me to understand how Atom packages works and served as a base for this package. Thanks @webBoxio!
