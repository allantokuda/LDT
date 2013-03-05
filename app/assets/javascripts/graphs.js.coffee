saveGraph = () ->
  graph = {}
  graph.entities = getCurrentEntities()
  graph.relationships = getCurrentRelationships()
  graph.settings = getSettings()

  #encodeData = encodeURIComponent("graph=" + JSON.stringify(graph))
  encodeData = "graph=" + JSON.stringify(graph)

  # PUT update existing graph if it exists; otherwise POST a new one
  currentID = graphID()
  if currentID
    $.ajax({ url:"/graphs/"+currentID, type:"PUT", dataType:"json", data:encodeData })
  else
    $.ajax({ url:"/graphs", type:"POST", dataType:"json", data:encodeData })

getCurrentEntities = () ->
  entities = []
  $("div.ui-dialog").each (index, element) ->
    entities[index] = {}
    entities[index].name   = $(element).find("span.ui-dialog-title").html()
    entities[index].id     = $(element).find("div.entity").attr("data-id")
    entities[index].width  = Math.floor($(element).width())
    entities[index].height = Math.floor($(element).height())
    entities[index].x      = Math.floor($(element).position().left)
    entities[index].y      = Math.floor($(element).position().top)
    entities[index].attrib = $(element).find("textarea.attributes").val()
  entities

getCurrentRelationships = () ->
  relationships = []
  # Add parameterization code here once relationships are implemented
  relationships

getSettings = () ->
  settings = {}
  $("#settings").find(".field").find("input,textarea").each (index, element) ->
    setting_name = element.name.replace("graph[","").replace("]","")
    settings[setting_name] = element.value
  settings

graphID = () ->
  window.location.pathname.split('/')[2]

$(document).ready ->
  $(".entity").each (index, element) ->
    entity_width  = parseInt( $(element).attr("data-width"))
    entity_height = parseInt( $(element).attr("data-height"))
    entity_x      = parseInt( $(element).attr("data-x"))
    entity_y      = parseInt( $(element).attr("data-y"))
    $(element).dialog({ width: entity_width, height: entity_height, position: [entity_x,entity_y] })

  $("#settings").hide()

  $("#save_button").click -> saveGraph()

  $('.entity').on 'dialogdrag', (event, ui) ->
    x = ui.position.left
    y = ui.position.top - $('#header_bar').height()
    $('#relationship1').attr('d', "M 0 0 L #{x} #{y}")
