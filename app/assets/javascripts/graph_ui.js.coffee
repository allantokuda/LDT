class window.GraphUI
  makeEntitiesDraggable: ->
    $(".entity").each (index, element) ->
      entity_width  = parseInt( $(element).attr("data-width"))
      entity_height = parseInt( $(element).attr("data-height"))
      entity_x      = parseInt( $(element).attr("data-x"))
      entity_y      = parseInt( $(element).attr("data-y"))
      $(element).dialog({ width: entity_width, height: entity_height, position: [entity_x,entity_y] })

  setupEntityHandlers: ->
    for eventType in ['dialogdrag', 'dialogresize']
      $('.entity').on eventType, (event, ui) ->
        g = new window.GraphUI
        g.drawRelationshipsFromEntity(event.currentTarget)

  entityBox: (entity_id) ->
    e = $('#entity' + entity_id).parent()

  entityCoordinates: (entity_id, xloc, yloc) ->
    e = @entityBox(entity_id)
    x = Math.round(e.offset().left + e.width() * xloc)
    y = Math.round(e.offset().top  + e.height() * yloc)
    return {x:x, y:y}

  entityCoordinate: (entity_id, side) ->
    e = @entityBox(entity_id)
    switch side
      when "left"   then coord = e.offset().left
      when "right"  then coord = e.offset().left + e.width()
      when "top"    then coord = e.offset().top
      when "bottom" then coord = e.offset().top + e.height()
    return Math.round(coord)

  drawAllRelationships: () ->
    for e in $('.entity')
      @drawRelationshipsFromEntity(e)

  drawRelationshipsFromEntity: (entity_tag) ->
    relationship_starts = JSON.parse(entity_tag.dataset.relationship_starts)
    relationship_ends   = JSON.parse(entity_tag.dataset.relationship_ends)

    for r in relationship_starts
      @drawRelationship(r.id, r.entity2_id, r.entity1_id)

    for r in relationship_ends
      @drawRelationship(r.id, r.entity1_id, r.entity2_id)

  drawRelationship: (relationship, entity1, entity2) ->

    endpoints = @relationshipEndpoints(entity1, entity2)
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

  relationshipEndpoints: (entity1, entity2) ->
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
          p1.x = @entityCoordinate(entity1, "right") - MARGIN
          p2.x = @entityCoordinate(entity2, "left" ) + MARGIN
        else
          p1.x = @entityCoordinate(entity1, "left" ) + MARGIN
          p2.x = @entityCoordinate(entity2, "right") - MARGIN

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
          p1.y = @entityCoordinate(entity1, "bottom") - MARGIN
          p2.y = @entityCoordinate(entity2, "top"   ) + MARGIN
        else
          p1.y = @entityCoordinate(entity1, "top"   ) + MARGIN
          p2.y = @entityCoordinate(entity2, "bottom") - MARGIN

    return [p1,p2]

  horizontal_relationship_y_coordinate: (entity1, entity2) ->
    e1 = @entityBox(entity1)
    e2 = @entityBox(entity2)
    height1 = e1.height()
    height2 = e2.height()
    top1 = e1.offset().top
    top2 = e2.offset().top
    center1 = top1 + height1 / 2
    center2 = top2 + height2 / 2
    offset = center2 - center1
    offset_max = (height1 + height2) / 2 - MARGIN * 2
    relationship_coord = center1 + (height1 / 2 - MARGIN) * offset / offset_max
    return Math.abs(relationship_coord)

  vertical_relationship_y_coordinate: (entity1, entity2) ->
    e1 = @entityBox(entity1)
    e2 = @entityBox(entity2)
    width1 = e1.width()
    width2 = e2.width()
    left1 = e1.offset().left
    left2 = e2.offset().left
    center1 = left1 + width1 / 2
    center2 = left2 + width2 / 2
    offset = center2 - center1
    offset_max = (width1 + width2) / 2 - MARGIN * 2
    relationship_coord = center1 + (width1 / 2 - MARGIN) * offset / offset_max
    return Math.abs(relationship_coord)

  closer_to_vertical_than_horizontal: (entity1, entity2) ->
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

  fully_vertical: (entity1, entity2) ->
    return @overlap(
      @entityCoordinate(entity1,"left" ) + MARGIN,
      @entityCoordinate(entity1,"right") - MARGIN,
      @entityCoordinate(entity2,"left" ) + MARGIN,
      @entityCoordinate(entity2,"right") - MARGIN
    )

  fully_horizontal: (entity1, entity2) ->
    return @overlap(
      @entityCoordinate(entity1,"top"   ) + MARGIN,
      @entityCoordinate(entity1,"bottom") - MARGIN,
      @entityCoordinate(entity2,"top"   ) + MARGIN,
      @entityCoordinate(entity2,"bottom") - MARGIN
    )

  overlap: (start1, end1, start2, end2) ->
    return (end1-start2)*(start1-end2) < 0
