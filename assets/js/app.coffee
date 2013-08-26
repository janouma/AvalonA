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

    #idleTimeout: -1

    #debug: on
  )

  frame3d2 = AvalonA(
    'body-3d'
    class: 'a3d2'
    zAttr: 'data-aaz'
    fy: (rotation)-> 0.75 * rotation
    fx: (rotation)-> 2 * rotation

    activeArea:
      position:
        x: 50
        y: 250
      attachment: 'scroll'
      width: 350
      height: 350

    on:
      startrotation: -> console.log "3d II rotation on"
      endrotation: -> console.log "3d II rotation off"

    animation: AvalonAnimation.Balance()
    #animation: AvalonAnimation.Spotlight()

    idleTimeout: -1

    debug: on
  )

  layerCursor = 0

  outer = $('[data-outter]')
  outer.attr('id', outer.attr('data-outter'))
  inner = $('[data-inner]')
  inner.addClass 'aa3d'

  $('#enable').click ->
    frame3d.enable()
    frame3d2.enable()
    $(@).css display: 'none'
    $('#enable2,#enable3').css display: 'none'
    $('#disable,#disable2,#disable3').css display: 'block'
    $('#shuffle-all,#shuffle-one').css display: 'inline'

  $('#disable').click ->
    $('#shuffle-all,#shuffle-one').css display: 'none'
    $(@).css display: 'none'
    $('#disable2,#disable3').css display: 'none'
    $('#enable,#enable2,#enable3').css display: 'block'
    frame3d.disable()
    frame3d2.disable()

  $('#shuffle-all').click ->
    $('[data-aaz]').each ->
      $(@).attr 'data-aaz': Math.round(Math.random() * 400 - 200)
    frame3d.zRefresh()


  $('#shuffle-one').click ->
    node = $('[data-aaz]').eq(layerCursor)
    node.attr 'data-aaz': Math.round(Math.random() * 400 - 200)
    frame3d.zRefresh(node)
    layerCursor = (layerCursor + 1) % $('[data-aaz]').size()

  $('#enable2').click ->
    frame3d2.enable()
    $(@).css display: 'none'
    $('#disable2').css display: 'block'

  $('#disable2').click ->
    frame3d2.disable()
    $(@).css display: 'none'
    $('#enable2').css display: 'block'

  $('#enable3').click ->
    frame3d.enable()
    $(@).css display: 'none'
    $('#disable3').css display: 'block'

  $('#disable3').click ->
    frame3d.disable()
    $(@).css display: 'none'
    $('#enable3').css display: 'block'