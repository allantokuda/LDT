# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

saveLDS = () ->
  lds = {}
  lds.entities = [];
  lds.relationships = [];

  $("div.ui-dialog").each (index, element) ->
    lds.entities[index] = {}
    lds.entities[index].name   = $(element).find("span.ui-dialog-title").html()
    lds.entities[index].width  = Math.floor($(element).width())
    lds.entities[index].height = Math.floor($(element).height())
    lds.entities[index].x      = Math.floor($(element).position().left)
    lds.entities[index].y      = Math.floor($(element).position().top)
    lds.entities[index].attrib = $(element).find("textarea.attributes").val()

  #encodeData = encodeURIComponent(JSON.stringify(lds))
  encodeData = JSON.stringify(lds)
  encodeData = "lds=#{encodeData}"

  console.log(encodeData)

  $.ajax({ url:"/lds/save?", type:"POST", dataType:"json", data:encodeData })

$(document).ready ->
  $(".entity").each (index, element) ->
    entity_width  = parseInt( $(element).attr("data-width"));
    entity_height = parseInt( $(element).attr("data-height"));
    entity_x      = parseInt( $(element).attr("data-x"));
    entity_y      = parseInt( $(element).attr("data-y"));
    $(element).dialog({ width: entity_width, height: entity_height, position: [entity_x,entity_y] });

  $("#save_button").click -> saveLDS()
