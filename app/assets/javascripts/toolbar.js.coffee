class window.Toolbar
  constructor: (ui, saver) ->
    $("#save_button").click -> saver.saveGraph()
    $("#new_entity_button").click -> ui.newEntity()
    $("#new_relationship_button").click -> ui.new_relationship()
    $("#delete_selected_button").click -> ui.deleteSelected()
    $("#settings").hide()
