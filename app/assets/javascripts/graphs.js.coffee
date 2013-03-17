$(document).ready ->
  ui = new window.GraphUI
  ui.makeEntitiesDraggable()
  ui.drawAllRelationships()
  ui.setupEntityHandlers()
  saver = new window.GraphSaver
  $("#save_button").click -> saver.saveGraph()
  $("#settings").hide()
