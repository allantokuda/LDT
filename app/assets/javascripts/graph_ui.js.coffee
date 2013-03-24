class window.GraphUI
  ARROWHEAD_MARGIN = 15
  RELATIONSHIP_SELECT_DIST = 50

  newID = 0

  creatingEntity = false
  ending_locations = {}

  @makeEntitiesDraggable: ->
    $(".entity").each (index, element) ->
      window.GraphUI.makeEntityDraggable(element)

  @makeEntityDraggable: (element) ->
    entity_width  = parseInt( $(element).attr("data-width"))
    entity_height = parseInt( $(element).attr("data-height"))
    entity_x      = parseInt( $(element).attr("data-x"))
    entity_y      = parseInt( $(element).attr("data-y"))
    $(element).dialog({ width: entity_width, height: entity_height, position: [entity_x,entity_y] })
    titlebar = $(element).parent().find('div.ui-dialog-titlebar')
    titlebar.on 'mousedown', (event) ->
      window.GraphUI.entitySelect(event.target.parentNode)

    titlebar.on 'dblclick', (event, ui) ->
      titlebar = $(event.currentTarget)
      span   = titlebar.find('span.ui-dialog-title')
      dialog = titlebar.parent()
      entityID = dialog.find('.entity')[0].id
      titlebar.append("<input id='edit_entity_name' data-entity-id='" + entityID + "' name='entity_name' type='text' value='" + span[0].innerText + "'>")
      input = titlebar.find('input')
      input.focus()
      input.on 'keyup', (e, ui) ->
        window.GraphUI.renameEntity() if e.keyCode == 13
        window.GraphUI.cancelRenameEntity() if e.keyCode == 27

  @renameEntity: ->
    input    = $('#edit_entity_name')
    input.parent().siblings('.newEntity').attr('data-name', input[0].value)
    input.siblings('.ui-dialog-title').text(input[0].value)
    entityID = input.attr('data-entity-id')
    $("#" + entityID).dialog('option', 'title', input[0].value)
    input.remove()

  @setupEntityHandlers: ->
    for eventType in ['dialogdrag', 'dialogresize']
      $('.entity').on eventType, (event, ui) ->
        g = window.GraphUI
        g.drawRelationshipsFromEntity(event.currentTarget)

  @entityBox: (entity_id) ->
    e = $('#entity' + entity_id).parent()

  @entityCoordinates: (entity_id, xloc, yloc) ->
    e = @entityBox(entity_id)
    x = Math.round(e.offset().left + e.width() * xloc)
    y = Math.round(e.offset().top  + e.height() * yloc)
    return {x:x, y:y}

  @entityCoordinate: (entity_id, side) ->
    e = @entityBox(entity_id)
    switch side
      when "left"   then coord = e.offset().left
      when "right"  then coord = e.offset().left + e.width()
      when "top"    then coord = e.offset().top
      when "bottom" then coord = e.offset().top + e.height()
    return Math.round(coord)

  @drawAllRelationships: () ->
    for e in $('.entity')
      @drawRelationshipsFromEntity(e)

  @drawRelationshipsFromEntity: (entity_tag) ->
    relationship_starts = JSON.parse(entity_tag.dataset.relationship_starts)
    relationship_ends   = JSON.parse(entity_tag.dataset.relationship_ends)

    for r in relationship_starts
      @drawRelationship(r.id, r.entity2_id, r.entity1_id)

    for r in relationship_ends
      @drawRelationship(r.id, r.entity1_id, r.entity2_id)

  @drawRelationship: (relationship, entity1, entity2) ->

    endpoints = @relationshipEndpoints(entity1, entity2)
    p1 = endpoints[0]
    p2 = endpoints[1]
    ending_locations["start" + relationship] = p1
    ending_locations["end"   + relationship] = p2

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

  @relationshipEndpoints: (entity1, entity2) ->
    p1 = {}
    p2 = {}

    center1 = @entityCoordinates(entity1, 0.5, 0.5)
    center2 = @entityCoordinates(entity2, 0.5, 0.5)

    if @closer_to_vertical_than_horizontal(entity1, entity2)

      if center1.y < center2.y
        p1.side = "bottom"
        p2.side = "top"
      else
        p1.side = "top"
        p2.side = "bottom"

      p1.y = @entityCoordinate(entity1, p1.side)
      p2.y = @entityCoordinate(entity2, p2.side)

      if @fully_vertical(entity1, entity2)
        p1.x = @vertical_relationship_y_coordinate(entity1, entity2)
        p2.x = p1.x
      else
        if center1.x < center2.x
          p1.x = @entityCoordinate(entity1, "right") - ARROWHEAD_MARGIN
          p2.x = @entityCoordinate(entity2, "left" ) + ARROWHEAD_MARGIN
        else
          p1.x = @entityCoordinate(entity1, "left" ) + ARROWHEAD_MARGIN
          p2.x = @entityCoordinate(entity2, "right") - ARROWHEAD_MARGIN

    else # closer to horizontal than vertical

      if center1.x < center2.x
        p1.side = "right"
        p2.side = "left"
      else
        p1.side = "left"
        p2.side = "right"

      p1.x = @entityCoordinate(entity1, p1.side)
      p2.x = @entityCoordinate(entity2, p2.side)

      if @fully_horizontal(entity1, entity2)
        p1.y = @horizontal_relationship_y_coordinate(entity1, entity2)
        p2.y = p1.y
      else
        if center1.y < center2.y
          p1.y = @entityCoordinate(entity1, "bottom") - ARROWHEAD_MARGIN
          p2.y = @entityCoordinate(entity2, "top"   ) + ARROWHEAD_MARGIN
        else
          p1.y = @entityCoordinate(entity1, "top"   ) + ARROWHEAD_MARGIN
          p2.y = @entityCoordinate(entity2, "bottom") - ARROWHEAD_MARGIN

    return [p1,p2]

  @horizontal_relationship_y_coordinate: (entity1, entity2) ->
    e1 = @entityBox(entity1)
    e2 = @entityBox(entity2)
    height1 = e1.height()
    height2 = e2.height()
    top1 = e1.offset().top
    top2 = e2.offset().top
    center1 = top1 + height1 / 2
    center2 = top2 + height2 / 2
    offset = center2 - center1
    offset_max = (height1 + height2) / 2 - ARROWHEAD_MARGIN * 2
    relationship_coord = center1 + (height1 / 2 - ARROWHEAD_MARGIN) * offset / offset_max
    return Math.round(relationship_coord)

  @vertical_relationship_y_coordinate: (entity1, entity2) ->
    e1 = @entityBox(entity1)
    e2 = @entityBox(entity2)
    width1 = e1.width()
    width2 = e2.width()
    left1 = e1.offset().left
    left2 = e2.offset().left
    center1 = left1 + width1 / 2
    center2 = left2 + width2 / 2
    offset = center2 - center1
    offset_max = (width1 + width2) / 2 - ARROWHEAD_MARGIN * 2
    relationship_coord = center1 + (width1 / 2 - ARROWHEAD_MARGIN) * offset / offset_max
    return Math.round(relationship_coord)

  @closer_to_vertical_than_horizontal: (entity1, entity2) ->
    entity_positions = [[0,0],[0,1],[1,1],[1,0]]
    min_dist = null

    # Find closest two corners between the two entities
    for pos1 in entity_positions
      coord1 = @entityCoordinates(entity1, pos1[0], pos1[1])

      for pos2 in entity_positions
        coord2 = @entityCoordinates(entity2, pos2[0], pos2[1])

        # Manhattan distance for simplicity
        dist_x = Math.abs(coord1.x - coord2.x)
        dist_y = Math.abs(coord1.y - coord2.y)
        dist = dist_x + dist_y

        if min_dist == null or dist < min_dist
          min_dist = dist
          result = dist_x < dist_y

    return result

  @fully_vertical: (entity1, entity2) ->
    return @overlap(
      @entityCoordinate(entity1,"left" ) + ARROWHEAD_MARGIN,
      @entityCoordinate(entity1,"right") - ARROWHEAD_MARGIN,
      @entityCoordinate(entity2,"left" ) + ARROWHEAD_MARGIN,
      @entityCoordinate(entity2,"right") - ARROWHEAD_MARGIN
    )

  @fully_horizontal: (entity1, entity2) ->
    return @overlap(
      @entityCoordinate(entity1,"top"   ) + ARROWHEAD_MARGIN,
      @entityCoordinate(entity1,"bottom") - ARROWHEAD_MARGIN,
      @entityCoordinate(entity2,"top"   ) + ARROWHEAD_MARGIN,
      @entityCoordinate(entity2,"bottom") - ARROWHEAD_MARGIN
    )

  @overlap: (start1, end1, start2, end2) ->
    return (end1-start2)*(start1-end2) < 0

  @startNewEntity: ->
    creatingEntity = true
    $('body').append("<div id='new_entity'><b>New Entity</b><br><ul><li>Click to place</li><li>ESC to cancel</li></div>")

    $(document).on 'mousemove', (e) ->
      $('#new_entity').css {left: e.pageX - 75, top: e.pageY - 100}

    $('#new_entity').keyup (e) ->
      window.GraphUI.cancelNewEntity if e.keyCode == 27

    $('#new_entity').on 'mouseup', (e) ->
      window.GraphUI.createNewEntity()

  @cancelNewEntity: ->
    creatingEntity = false
    $('#new_entity').remove()

  @createNewEntity: ->
    ghost = $('#new_entity')
    real = $('<div/>')
    # Really jQuery?  This was the only syntax that seemed to work.
    real.attr 'class', 'entity newEntity'
    real.attr 'title', 'new entity ' + newID
    real.attr 'data-name', 'new entity ' + newID
    real.attr 'data-width',  ghost.width()
    real.attr 'data-height', ghost.height()
    real.attr 'data-x', ghost.offset().left
    real.attr 'data-y', ghost.offset().top
    real.attr 'data-relationship_starts', ""
    real.attr 'data-relationship_ends', ""

    real.append $('<form class="entity-attributes"><textarea name="attributes" class="attributes"></textarea></form>')
    real.appendTo $('body')
    @makeEntityDraggable(real)
    ghost.remove()

  @startNewRelationship: ->
    creatingRelationship = true
    console.log 'pick an entity'

  @cancelNewRelationship: ->
    creatingRelationship = false
    console.log 'relationship creation cancelled'

  @pickRelationshipEntity: ->
    # impement state machine: begin -> 1st picked -> 2nd picked and createNewRelationship() below

  @drawNewRelationship: (e1, e2) ->
    # lookup which entities have been picked, or receive them in argument here
    # add relationship to DOM in same way as the page loader does

  @entitySelect: (ent) ->
    window.GraphUI.deselectAll()
    $(ent).addClass 'selectedEntity'

  @deselectAll: ->
    $('.selectedEntity').removeClass 'selectedEntity'
    $('#relationship_ending_highlight').remove()

  @relationshipSelect: (e) ->
    min_dist = null
    for key in Object.keys(ending_locations)
      ending = ending_locations[key]
      dist = Math.round(Math.sqrt(Math.pow(ending.x - e.pageX, 2) + Math.pow(ending.y - e.pageY, 2)))
      if min_dist == null or dist < min_dist
        min_dist = dist
        closest = key
        ending_pos = ending

    window.GraphUI.deselectAll()
    if min_dist < RELATIONSHIP_SELECT_DIST
      $('body').append('<div id="relationship_ending_highlight"></div>')
      switch ending_pos.side
        when "top"    then offsets = [-20, -40]
        when "bottom" then offsets = [-20,   0]
        when "left"   then offsets = [-40, -20]
        when "right"  then offsets = [  0, -20]
      $('#relationship_ending_highlight').css {left: (ending_pos.x + offsets[0]); top: (ending_pos.y + offsets[1])}
