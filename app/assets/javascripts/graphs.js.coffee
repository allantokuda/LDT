saveGraph = ->
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

getCurrentEntities = ->
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

getCurrentRelationships = ->
  relationships = []
  # Add parameterization code here once relationships are implemented
  relationships

getSettings = ->
  settings = {}
  $("#settings").find(".field").find("input,textarea").each (index, element) ->
    setting_name = element.name.replace("graph[","").replace("]","")
    settings[setting_name] = element.value
  settings

graphID = ->
  window.location.pathname.split('/')[2]

makeEntitiesDraggable = ->
  $(".entity").each (index, element) ->
    entity_width  = parseInt( $(element).attr("data-width"))
    entity_height = parseInt( $(element).attr("data-height"))
    entity_x      = parseInt( $(element).attr("data-x"))
    entity_y      = parseInt( $(element).attr("data-y"))
    $(element).dialog({ width: entity_width, height: entity_height, position: [entity_x,entity_y] })

addRelationshipsToDOM = ->
  for relationship, index in window.relationships.length
    paths = paths + '<path id="relationship' + index + '" stroke="black" stroke-width="2" fill="none" />'
  $('#relationships').html(paths)

setupEntityDragHandler = ->
  $('.entity').on 'dialogdrag', (event, ui) ->
    relationship_starts = JSON.parse(event.currentTarget.dataset.relationship_starts)
    relationship_ends   = JSON.parse(event.currentTarget.dataset.relationship_ends)

    for r in relationship_starts
      drawRelationship(r.id, r.entity2_id, r.entity1_id)

    for r in relationship_ends
      drawRelationship(r.id, r.entity1_id, r.entity2_id)

entityCoordinates = (entity_id) ->
  e = $('#entity' + entity_id).parent()
  x = e.offset().left + e.width() / 2
  y = e.offset().top  + e.height() / 2
  return {x:x, y:y}

drawRelationship = (relationship, entity1, entity2) ->
  coord1 = entityCoordinates(entity1)
  coord2 = entityCoordinates(entity2)
  $('#relationship' + relationship).attr('d', "M #{coord1.x} #{coord1.y} L #{coord2.x} #{coord2.y}")

$(document).ready ->
  makeEntitiesDraggable()
  addRelationshipsToDOM()
  setupEntityDragHandler()
  $("#settings").hide()
  $("#save_button").click -> saveGraph()
