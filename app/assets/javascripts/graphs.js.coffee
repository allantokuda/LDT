$(document).ready ->
  ui = new window.GraphUI
  ui.makeEntitiesDraggable()
  ui.drawAllRelationships()
  ui.setupEntityHandlers()
  saver = new window.GraphSaver
  toolbar = new window.Toolbar(ui, saver)
