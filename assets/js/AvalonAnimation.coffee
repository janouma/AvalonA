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

    duration ?= 2.75

    throw new Error "Balance.from.rx cannot be null" if not from.rx?
    throw new Error "Balance.from.ry cannot be null" if not from.ry?
    throw new Error "Balance.to.rx cannot be null" if not to.rx?
    throw new Error "Balance.to.ry cannot be null" if not to.ry?
    throw new Error "Balance.duration cannot be null" if not parseFloat(duration)

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
        TweenLite.to(
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
