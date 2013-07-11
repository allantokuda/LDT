$(document).ready ->
  ui = window.GraphUI
  saver = window.GraphSaver
  toolbar = window.Toolbar(ui, saver)
  ui.makeEntitiesDraggable()
  ui.drawAllRelationships()
  ui.setupEntityHandlers()
  ui.setupNewRelationshipHandlers()
