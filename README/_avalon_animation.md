# <a name="avalonAnimation"></a> AvalonAnimation
Provides a collection of preset animations.

## <a name="balance"></a> Balance
Adds a balancing movement between two rotation angles.

##### *Dependencies*

- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenMax** module

Note that the **TweenMax** module includes the **TweenLite** one *– see [GSAP](http://www.greensock.com) documentation for details*.

##### *Examples*
*Example 1*

``` js
animation: AvalonAnimation.Balance()
```

*Example 2*

``` js
animation: AvalonAnimation.Balance({
  duration: 0.75,

  from:{
    rx: 30,
    ry: -30
  },

  to:{
    rx: -90,
    ry: 30
  }
})
```

##### *Options*

- duration *(seconds)* – ***default value is 2.75***
- from: { rx: *< rotation on X axis >*, ry: *< rotation on Y axis >* } – ***default value is { rx: 0 , ry: -20 }***
- to: { rx: *< rotation on X axis >*, ry: *< rotation on Y axis >* } – ***default value is the negative version of `from`***

## <a name="spotlight"></a> Spotlight
Rotates like a spotlight.

##### *Dependencies*

- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenMax** and **BezierPlugin** modules

Note that the **TweenMax** module includes the **TweenLite** and **BezierPlugin** ones *– see [GSAP](http://www.greensock.com) documentation for details*.

##### *Examples*
*Example 1*

``` js
animation: AvalonAnimation.Spotlight()
```

*Example 2*

``` js
animation: AvalonAnimation.Spotlight({
  duration: 5,
  direction: 'ccw',
  angle: 10
})
```

##### *Options*

- duration *(seconds)* – ***default value is 8***
- direction `'cw'` *(clockwise)* or `'ccw'` *(counter-clockwise)* – ***default value is 'cw'***
- angle – ***default value is 20***

## <a name="atom"></a> Atom
Rotates a layer or a group of layers like electrons around an atom's nucleus.

##### *Dependencies*
- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenMax** module

##### *Example*

``` js
animation: AvalonAnimation.Atom({
  duration: 20,
  selector: '.electron',
  axis: ['y','z']
})
```

##### *Options*
- duration *(seconds)* – ***default value is 2.75***

- selector – every <small>non-transformed</small> <sup>(*)</sup> div within the `transformed layer` matching this selector will rotate, along with all his children.

- axis – the axis on which elements will rotate ***(default values are x,y and z)***

<sup>(*)</sup> <small>non-transformed means not having the `data-avalonA-transform` attribute (or the one define through "tAttr" option).</small>