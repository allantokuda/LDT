class window.Toolbar
  constructor: (ui, saver) ->
    $("#save_button").click -> saver.saveGraph()
    $("#new_entity_button").click -> ui.startNewEntity()
    $("#new_relationship_button").click -> ui.startNewRelationship()
    $("#delete_selected_button").click -> ui.deleteSelected()
    $("#settings").hide()
