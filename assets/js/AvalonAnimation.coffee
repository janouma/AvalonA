### AvalonAnimation ###

window.AvalonAnimation =

  ### Balance ###

  Balance: (options={})->
    {from: from, to: to, duration: duration} = options

    from ?=
      rx: 0
      ry: -20

    to ?=
      rx: -from.rx
      ry: -from.ry

    duration = if not duration? then 2.75 else parseFloat(duration)

    throw new Error "Balance.from.rx cannot be null" if not from.rx?
    throw new Error "Balance.from.ry cannot be null" if not from.ry?
    throw new Error "Balance.to.rx cannot be null" if not to.rx?
    throw new Error "Balance.to.ry cannot be null" if not to.ry?
    throw new Error "Balance.duration is not valid" if not duration

    getTimeline: ->
      @timeline = new TweenMax(
        @animatedObject
        duration
        paused: on
        css:
          rotationX: to.rx
          rotationY: to.ry
        repeat: -1
        yoyo: on
        ease: Power1.easeInOut
      )

    play: (target)->
      @animatedObject = target if target

      if @animatedObject
        @timeline = TweenLite.to(
          @animatedObject
          duration
          overwrite: on
          css:
            rotationX: from.rx
            rotationY: from.ry
          ease: Power1.easeInOut
          onComplete: => @getTimeline().play()
        )

    pause: -> @timeline?.pause()


  ### Spotlight ###

  Spotlight: (options={})->
    {direction: direction, duration: duration, angle: angle} = options

    direction ?= 'cw'
    duration = if not duration? then 8 else parseFloat(duration)
    angle = if not angle? then 20 else parseFloat(angle)

    throw new Error "Spotlight.direction must be either 'cw'(clockwise) or 'ccw'(counter-clockwise)" if direction not in ['cw', 'ccw']
    throw new Error "Spotlight.duration is not valid" if not duration
    throw new Error "Spotlight.angle is not valid" if not angle or not (0 <= angle <= 180)

    path = [
      {rotationX: angle, rotationY: 0}
      {rotationX: 0, rotationY: angle}
      {rotationX: -angle, rotationY: 0}
      {rotationX: 0, rotationY: -angle}
      {rotationX: angle, rotationY: 0}
    ]

    path = path.reverse() if direction is 'ccw'

    lastPosition = path[path.length - 1]

    getTimeline: ->
      @timeline = new TweenMax(
        @animatedObject
        duration
        paused: on
        overwrite: on
        repeat: -1
        ease: Linear.easeNone
        bezier: path
      )

    play: (target)->
      @animatedObject = target if target
      if @animatedObject
        @timeline = TweenLite.to(
          @animatedObject
          duration / 4
          overwrite: on
          ease: Linear.easeNone
          bezier: [lastPosition]
          onComplete: => @getTimeline().play()
        )

    pause: -> @timeline?.pause()