# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

saveLDS = () ->
  $("div.ui-dialog").each (index, element) ->
    entity = {}
    entity.name   = $(element).find("span.ui-dialog-title").html()
    entity.width  = Math.floor($(element).width())
    entity.height = Math.floor($(element).height())
    entity.x      = Math.floor($(element).position().left)
    entity.y      = Math.floor($(element).position().top)

    console.log($.param(entity))

$(document).ready ->
  $(".entity").each (index, element) ->
    entity_width  = parseInt( $(element).attr("data-width"));
    entity_height = parseInt( $(element).attr("data-height"));
    entity_x      = parseInt( $(element).attr("data-x"));
    entity_y      = parseInt( $(element).attr("data-y"));
    $(element).dialog({ width: entity_width, height: entity_height, position: [entity_x,entity_y] });

  $("#save_button").click -> saveLDS()
