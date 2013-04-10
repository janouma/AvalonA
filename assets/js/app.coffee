$ ->
  frame3d = AvalonA('body-3d')
  layerCursor = 0

  $('#start').click ->
    outer = $('[data-outter]')
    outer.attr id: outer.attr('data-outter')
    inner = $('[data-inner]')
    inner.addClass 'avalona-inner-frame'
    frame3d.start()
    $(@).css display: 'none'
    $('#shuffle-all,#shuffle-one').css display: 'inline'

  $('#shuffle-all').click ->
    $('[data-avalonA-deepness]').each ->
      $(@).attr 'data-avalonA-deepness': Math.round(Math.random() * 400 - 200)
    frame3d.refreshDeepness()


  $('#shuffle-one').click ->
    node = $('[data-avalonA-deepness]').eq(layerCursor)
    node.attr 'data-avalonA-deepness': Math.round(Math.random() * 400 - 200)
    frame3d.refreshDeepness(node)
    layerCursor = (layerCursor + 1) % $('[data-avalonA-deepness]').size()