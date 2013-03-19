class window.GraphSaver
  @saveGraph: ->
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
      entities[index] = {}
      entities[index].name   = $(element).find("span.ui-dialog-title").html()
      entities[index].id     = $(element).find("div.entity").attr("data-id")
      entities[index].width  = Math.floor($(element).width())
      entities[index].height = Math.floor($(element).height())
      entities[index].x      = Math.floor($(element).position().left)
      entities[index].y      = Math.floor($(element).position().top)
      entities[index].attrib = $(element).find("textarea.attributes").val()
    entities

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
