$ ->
  frame3d = AvalonA('body-3d')
  layerCursor = 0

  $('#shuffle-all').click ->
    $('[data-avalonA-deepness]').each ->
      $(this).attr 'data-avalonA-deepness': Math.round(Math.random() * 400 - 200)
    frame3d.refresh()


  $('#shuffle-one').click ->
    node = $('[data-avalonA-deepness]').eq(layerCursor)
    node.attr 'data-avalonA-deepness': Math.round(Math.random() * 400 - 200)
    frame3d.refresh(node)
    layerCursor = (layerCursor + 1) % $('[data-avalonA-deepness]').size()