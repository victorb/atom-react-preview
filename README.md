# Atom React Preview

A previewing tool for React Components. Works best for stateless components.

Features:

* Reload your component on save
* Editing the props in the preview area
* Saving the edits for when you save your component

Like hot reloading, but within Atom!

Known issues:

* If you import other things in top of your component, like LESS/SASS styles, it'll break
* You need to specify `'use babel'` in the top of the file
* Doesn't load correctly when reloading window (opening/closing the panel solves this problem)
* The codebase is a mess, based on atom-html-preview and only got time for minor refactoring atm, will get to that

Install:

```bash
apm install atom-react-preview
```

Inside Atom:

Go to "Install Packages" and search for atom-react-preview

Toggle React Preview:

Press `CTRL-SHIFT-M` in the editor to open the preview pane.

![Atom React Preview](http://i.imgur.com/wmR7IGm.gif)
