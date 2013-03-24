class window.GraphSaver
  @saveGraph: ->
    @postNewEntities()

    graph = {}
    graph.entities      = @getCurrentEntities()
    graph.relationships = @getCurrentRelationships()
    graph.settings      = @getSettings()

    #encodeData = encodeURIComponent("graph=" + JSON.stringify(graph))
    encodeData = "graph=" + JSON.stringify(graph)

    # PUT update existing graph if it exists; otherwise POST a new one
    currentID = @graphID()
    if currentID
      $.ajax({ url:"/graphs/"+currentID, type:"PUT", dataType:"json", data:encodeData })
    else
      $.ajax({ url:"/graphs", type:"POST", dataType:"json", data:encodeData })

  @getCurrentEntities: ->
    entities = []
    $("div.ui-dialog").each (index, element) ->
      entities[index] = window.GraphSaver.objectifyEntity(element)
    entities

  @objectifyEntity: (element) ->
    entity = {}
    entity.name   = $(element).find("span.ui-dialog-title").html()
    entity.id     = $(element).find("div.entity").attr("data-id")
    entity.width  = Math.floor($(element).width())
    entity.height = Math.floor($(element).height())
    entity.x      = Math.floor($(element).position().left)
    entity.y      = Math.floor($(element).position().top)
    entity.attrib = $(element).find("textarea.attributes").val()
    entity.graph_id = window.GraphSaver.graphID()
    console.log ">>>>>>"
    console.log entity
    entity

  @postNewEntities: ->
    $(".newEntity").each (index, element) ->
      entity = window.GraphSaver.objectifyEntity($(element).parent())
      encodeData = "entity=" + JSON.stringify(entity)
      $.ajax '/entities',
        type:"POST"
        dataType:"json"
        data:encodeData
        error: (jqXHR, textStatus, errorThrown) ->
          console.log "AJAX Error: "
          console.log textStatus
        success: (data, textStatus, jqXHR) ->
          console.log data.id
          $(element).attr 'id', 'entity' + data.id
          $(element).attr 'data-id', data.id
          $(element).removeClass("newEntity")

  @getCurrentRelationships: ->
    relationships = []
    # Add parameterization code here once relationships are implemented
    relationships

  @getSettings: ->
    settings = {}
    $("#settings").find(".field").find("input,textarea").each (index, element) ->
      setting_name = element.name.replace("graph[","").replace("]","")
      settings[setting_name] = element.value
    settings

  @graphID: ->
    window.location.pathname.split('/')[2]
