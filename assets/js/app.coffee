$ ->
  frame3d = AvalonA(
    'body-3d'
    class: 'aa3d'
    zAttr: 'data-aaz'
    fy: (rotation)-> 0.5 * rotation
    fx: (rotation)-> 2 * rotation

    activeArea:
      ###
      position:
        x: 50
        y: '10%'
      ###
      attachment: 'scroll'
      width: '75%'
      height: 350

    on:
      startrotation: -> console.log "3d rotation on"
      endrotation: -> console.log "3d rotation off"

    #debug: on
  )

  layerCursor = 0

  $('#start').click ->
    outer = $('[data-outter]')
    outer.attr('id', outer.attr('data-outter'))
    inner = $('[data-inner]')
    inner.addClass 'aa3d'
    frame3d.start()
    $(@).css display: 'none'
    $('#shuffle-all,#shuffle-one').css display: 'inline'

  $('#shuffle-all').click ->
    $('[data-aaz]').each ->
      $(@).attr 'data-aaz': Math.round(Math.random() * 400 - 200)
    frame3d.zRefresh()


  $('#shuffle-one').click ->
    node = $('[data-aaz]').eq(layerCursor)
    node.attr 'data-aaz': Math.round(Math.random() * 400 - 200)
    frame3d.zRefresh(node)
    layerCursor = (layerCursor + 1) % $('[data-aaz]').size()