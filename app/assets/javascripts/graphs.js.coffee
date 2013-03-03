# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

saveGraph = () ->
  currentID = graphID()
  graph = {}
  graph.entities = [];
  graph.relationships = [];

  $("div.ui-dialog").each (index, element) ->
    graph.entities[index] = {}
    graph.entities[index].name   = $(element).find("span.ui-dialog-title").html()
    graph.entities[index].id     = $(element).find("div.entity").attr("data-id")
    graph.entities[index].width  = Math.floor($(element).width())
    graph.entities[index].height = Math.floor($(element).height())
    graph.entities[index].x      = Math.floor($(element).position().left)
    graph.entities[index].y      = Math.floor($(element).position().top)
    graph.entities[index].attrib = $(element).find("textarea.attributes").val()

  #encodeData = encodeURIComponent(JSON.stringify(graph))
  encodeData = JSON.stringify(graph)
  encodeData = "graph=#{encodeData}"

  console.log(encodeData)

  currentID = graphID()

  if currentID
    $.ajax({ url:"/graphs/"+currentID, type:"PUT", dataType:"json", data:encodeData })
  else
    $.ajax({ url:"/graphs", type:"POST", dataType:"json", data:encodeData })


graphID = () ->
  window.location.pathname.split('/')[2]

$(document).ready ->
  $(".entity").each (index, element) ->
    entity_width  = parseInt( $(element).attr("data-width"));
    entity_height = parseInt( $(element).attr("data-height"));
    entity_x      = parseInt( $(element).attr("data-x"));
    entity_y      = parseInt( $(element).attr("data-y"));
    $(element).dialog({ width: entity_width, height: entity_height, position: [entity_x,entity_y] });

  $("#save_button").click -> saveGraph()
