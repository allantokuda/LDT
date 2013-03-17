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

setupEntityHandlers = ->
  for eventType in ['dialogdrag', 'dialogresize']
    $('.entity').on eventType, (event, ui) ->
      drawRelationshipsFromEntity(event.currentTarget)

entityCoordinates = (entity_id, xloc, yloc) ->
  e = $('#entity' + entity_id).parent()
  x = Math.round(e.offset().left + e.width() * xloc)
  y = Math.round(e.offset().top  + e.height() * yloc)
  return {x:x, y:y}

entityCoordinate = (entity_id, side) ->
  e = $('#entity' + entity_id).parent()
  switch side
    when "left"   then coord = e.offset().left
    when "right"  then coord = e.offset().left + e.width()
    when "top"    then coord = e.offset().top
    when "bottom" then coord = e.offset().top + e.height()
  return Math.round(coord)

drawRelationshipsFromEntity = (entity_tag) ->
  relationship_starts = JSON.parse(entity_tag.dataset.relationship_starts)
  relationship_ends   = JSON.parse(entity_tag.dataset.relationship_ends)

  for r in relationship_starts
    drawRelationship(r.id, r.entity2_id, r.entity1_id)

  for r in relationship_ends
    drawRelationship(r.id, r.entity1_id, r.entity2_id)

drawAllRelationships = () ->
  for e in $('.entity')
    drawRelationshipsFromEntity(e)

drawRelationship = (relationship, entity1, entity2) ->

  endpoints = relationshipEndpoints(entity1, entity2)
  p1 = endpoints[0]
  p2 = endpoints[1]

  chickenfoot = {}
  chickenfoot["left"  ] = "m   0  15 l -40 -15 l  40 -15 "
  chickenfoot["right" ] = "m   0 -15 l  40  15 l -40  15 "
  chickenfoot["top"   ] = "m -15   0 l  15 -40 l  15  40 "
  chickenfoot["bottom"] = "m  15   0 l -15  40 l -15 -40 "

  offset = {}
  offset["left"  ] = {dx:-50, dy:  0}
  offset["right" ] = {dx: 50, dy:  0}
  offset["top"   ] = {dx:  0, dy:-50}
  offset["bottom"] = {dx:  0, dy: 50}

  o1 = offset[p1.side]
  o2 = offset[p2.side]

  svg_path = "M #{p1.x} #{p1.y} " + chickenfoot[p1.side] +
             "M #{p2.x} #{p2.y} " + chickenfoot[p2.side] +
             "M #{p1.x} #{p1.y} " +
             "L #{p1.x + o1.dx} #{p1.y + o1.dy} " +
             "L #{p2.x + o2.dx} #{p2.y + o2.dy} " +
             "L #{p2.x} #{p2.y} "

  $('#relationship' + relationship).attr('d', svg_path)

MARGIN = 15

relationshipEndpoints = (entity1, entity2) ->
  p1 = {}
  p2 = {}

  center1 = entityCoordinates(entity1, 0.5, 0.5)
  center2 = entityCoordinates(entity2, 0.5, 0.5)

  if closer_to_vertical_than_horizontal(entity1, entity2)

    if center1.y < center2.y
      p1.side = "bottom"
      p2.side = "top"
    else
      p1.side = "top"
      p2.side = "bottom"

    p1.y = entityCoordinate(entity1, p1.side)
    p2.y = entityCoordinate(entity2, p2.side)

    if fully_vertical(entity1, entity2)
      p1.x = Math.round((center1.x + center2.x) / 2)
      p2.x = p1.x
    else
      if center1.x < center2.x
        p1.x = entityCoordinate(entity1, "right") - MARGIN
        p2.x = entityCoordinate(entity2, "left" ) + MARGIN
      else
        p1.x = entityCoordinate(entity1, "left" ) + MARGIN
        p2.x = entityCoordinate(entity2, "right") - MARGIN

  else # closer to horizontal than vertical

    if center1.x < center2.x
      p1.side = "right"
      p2.side = "left"
    else
      p1.side = "left"
      p2.side = "right"

    p1.x = entityCoordinate(entity1, p1.side)
    p2.x = entityCoordinate(entity2, p2.side)

    if fully_horizontal(entity1, entity2)
      p1.y = Math.round((center1.y + center2.y) / 2)
      p2.y = p1.y
    else
      if center1.y < center2.y
        p1.y = entityCoordinate(entity1, "bottom") - MARGIN
        p2.y = entityCoordinate(entity2, "top"   ) + MARGIN
      else
        p1.y = entityCoordinate(entity1, "top"   ) + MARGIN
        p2.y = entityCoordinate(entity2, "bottom") - MARGIN

  return [p1,p2]

closer_to_vertical_than_horizontal = (entity1, entity2) ->
  entity_positions = [[0,0],[0,1],[1,1],[1,0]]
  min_dist = null

  # Find closest two corners between the two entities
  for pos1 in entity_positions
    coord1 = entityCoordinates(entity1, pos1[0], pos1[1])

    for pos2 in entity_positions
      coord2 = entityCoordinates(entity2, pos2[0], pos2[1])

      # Manhattan distance for simplicity
      dist_x = Math.abs(coord1.x - coord2.x)
      dist_y = Math.abs(coord1.y - coord2.y)
      dist = dist_x + dist_y

      if min_dist == null or dist < min_dist
        min_dist = dist
        result = dist_x < dist_y

  return result

fully_vertical = (entity1, entity2) ->
  return overlap(
    entityCoordinate(entity1,"left" ) + MARGIN,
    entityCoordinate(entity1,"right") - MARGIN,
    entityCoordinate(entity2,"left" ) + MARGIN,
    entityCoordinate(entity2,"right") - MARGIN
  )

fully_horizontal = (entity1, entity2) ->
  return overlap(
    entityCoordinate(entity1,"top"   ) + MARGIN,
    entityCoordinate(entity1,"bottom") - MARGIN,
    entityCoordinate(entity2,"top"   ) + MARGIN,
    entityCoordinate(entity2,"bottom") - MARGIN
  )

overlap = (start1, end1, start2, end2) ->
  return (end1-start2)*(start1-end2) < 0

# Calculate y3 to pair with given x3 and to make (x3,y3) fall on the line from (x1,y1) to (x2,y2)
interpolate = (x1,y1,x2,y2,x3) ->
  return Math.round((x3-x1)/(x2-x1)*(y2-y1)+y1)

$(document).ready ->
  makeEntitiesDraggable()
  drawAllRelationships()
  setupEntityHandlers()
  $("#settings").hide()
  $("#save_button").click -> saveGraph()
