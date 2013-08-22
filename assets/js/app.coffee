$ ->
  frame3d = AvalonA(
    'body-3d'
    class: 'aa3d'
    zAttr: 'data-aaz'
    fy: (rotation)-> 0.75 * rotation
    fx: (rotation)-> 2 * rotation

    activeArea:
      #position:
      #  x: 50
      #  y: '10%'
      attachment: 'scroll'
      width: '75%'
      height: 350

    on:
      startrotation: -> console.log "3d rotation on"
      endrotation: -> console.log "3d rotation off"

    animation: AvalonAnimation.Balance()
    #animation: AvalonAnimation.Spotlight()

    #debug: on
  )

  layerCursor = 0

  $('#enable').click ->
    if not outer?
      outer = $('[data-outter]')
      outer.attr('id', outer.attr('data-outter'))
      inner = $('[data-inner]')
      inner.addClass 'aa3d'

    frame3d.enable()
    $(@).css display: 'none'
    $('#disable').css display: 'block'
    $('#shuffle-all,#shuffle-one').css display: 'inline'

  $('#disable').click ->
    $('#shuffle-all,#shuffle-one').css display: 'none'
    $(@).css display: 'none'
    $('#enable').css display: 'block'
    frame3d.disable()

  $('#shuffle-all').click ->
    $('[data-aaz]').each ->
      $(@).attr 'data-aaz': Math.round(Math.random() * 400 - 200)
    frame3d.zRefresh()


  $('#shuffle-one').click ->
    node = $('[data-aaz]').eq(layerCursor)
    node.attr 'data-aaz': Math.round(Math.random() * 400 - 200)
    frame3d.zRefresh(node)
    layerCursor = (layerCursor + 1) % $('[data-aaz]').size()