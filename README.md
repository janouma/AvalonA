# Avalon(A) — Bring deepness to your web apps

*version: 0.8.2*


**Avalon(A)** allows you to easily add 3d to a set of html elements to simulate a deepness effect *([see jsFiddle preview](http://jsfiddle.net/K3kPx/4/show))*. To make this 3d effect noticeable, all html elements pertaining to the `transformed layer` *(basically the root container to which the 3d effect get applied to)* - rotate on their x and y axis according to mouse movements.

# Dependencies
- [Zepto.js 1.0+](http://zeptojs.com) or [jQuery 1.9.1+](http://jquery.com)
- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenLite** and **CSSPlugin** modules

# Example
## Html
	<div id="frame-3d"> <!-- 3d Frame -->
    	<div id="avalona-inner-frame"> <!-- transformed layer -->
        	<div id="half-circle" data-avalonA-deepness="-300"></div>
        		<div id="square" data-avalonA-deepness="75">
            		<div id="inner-square" data-avalonA-deepness="150"></div>
        		</div>
        	<div id="circle" data-avalonA-deepness="200"></div>
    	</div>
	</div>

It is mandatory to have at least the `3d Frame` and `transformed layer` defined when **Avalon(A)** initialization occurs. Within the `3d Frame`, the element div having the id `avalona-inner-frame` becomes the `transformed layer`.

## Script
    $(function(){
        AvalonA('frame-3d', 'avalona-inner-frame').start();
    });

# API
## Constructor options
It is possible to pass an object along with the id of the `3d Frame` to set options:

    $(function(){
        AvalonA('frame-3d', 'avalona-inner-frame', {option: value}).start();
    });

##### *zAttr*
Changes the name of the attribute used to define layer **z translation**. Default value is `data-avalonA-deepness`.

##### *fy*
A function that affects the amount of rotation triggered by the mouse movements on the **y axis**.

	AvalonA('frame-3d', 'avalona-inner-frame', {fy: function(rotation){
		return rotation * 2;
	} }).start();

Default function as no effect on the rotation value.

##### *fx*
A function that affects the amount of rotation triggered by the mouse movements on the **x axis**. Default function as no effect on the rotation value.

##### *activeArea*
When available, restrict mouse movements tracking to this area: moving outside the area reset the `transformed layer` rotation.

	var options = {
		activeArea: {
			position: {
				x: 'auto',
				y: '15%'
			},
			attachment: 'scroll',
			width: '150px',
			height: 100
		}
	};
	AvalonA('frame-3d', 'avalona-inner-frame', options).start();

Enable the `debug` option to display the area *( for development purpose only )*.

##### *activeArea.width*

- numeric like `200`
- length like `'200px'`
- percent like `'30%'`

##### *activeArea.height*

- numeric like `100`
- length like `'100px'`
- percent like `'20%'`


##### *[activeArea.position]*
Set the position of the area. Possible values:

- `'auto'` means that the area will be centered within the browser window. ***(default)***
- `{x: value, y: value}` where ***value*** can be
	- `null`
	- `'auto'`
	- numeric
	- length
	- percent

##### *[activeArea.attachment]*
Act like css `position: absolute|fixed`. Possible values:

- `'fixed'` same as css `position: fixed`. ***(default)***
- `'scroll'` like css `position: absolute`, the area will scroll along with the `transformed layer`

##### *animation*
Animates the `transformed layer` when mouse is outside the active area *– meaning the actual `activeArea` or simply the `3d Frame` when no `activeArea` is provided*. The animation plays as well when the mouse is iddle.

The `animation` object must have the following api:

	animation: {
	
		play: function(transformedLayer){
			// animation code goes here
		},
		
		pause: function(){
			// pause code goes here
		}
	}
	
As the example shows, the `play()` method received as first argument the `transformed layer`, thus one can animate any attribute of this element *– not just the rotation*.

##### *idleTimeout*
The delay, in milliseconds, after which the user is considered idle when there is no mouse movements:

- Default value is **1000**
- **0** is equivalent to default
- Any negative value means ***infinite***

When the user is idle, the animation resumes *– if any –* and `endrotation` event is triggered.


##### *debug*
Enable debug logs and display when set to `true`.

## Methods
##### *refresh()*
Fetch `3d Frame` and `transformed layer` from the DOM and apply initial setup.

##### *start()*
Alias for ***refresh()***.

##### *enable()*
Alias for ***refresh()***.

##### *disable()*
Flatten `transformed layer`, remove mouse movement tracking, unable events and pause animation.

##### *zRefresh( [target : selector OR html node] )*
Update **z translation** according to new values of `data-avalonA-deepness`.
When **target** is provided, only matching html nodes get updated.

##  Events
It is possible to add event listeners like this

	var options = {
    	on: {
    		event: function(){ /* event code goes here */ },
    	}
	};
	AvalonA('frame-3d', 'avalona-inner-frame', options).start();
	
or this

	var a = AvalonA('frame-3d', 'avalona-inner-frame', options);
	a.onevent = function(){ /* event code goes here */ };
	a.start();
	
Available events:

##### *startrotation*
Triggered when `transformed layer` rotation starts.

##### *endrotation*
Triggered when `transformed layer` rotation ends.

# Plugins
## AvalonAnimation
Provides a collection of preset animations.

### Balance
Adds a balancing movement between two rotation angles.

###### *Dependencies*

- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenMax** module

Note that the **TweenMax** module includes the **TweenLite** one *– see [GSAP](http://www.greensock.com) documentation for details*.

###### *Examples*
*Example 1*

	animation: AvalonAnimation.Balance()
	
*Example 2*

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

###### *Options*

- duration *(seconds)* – ***default value is 2.75***
- from: { rx: *< rotation on X axis >*, ry: *< rotation on Y axis >* } – ***default value is { rx: 0 , ry: -20 }***
- to: { rx: *< rotation on X axis >*, ry: *< rotation on Y axis >* } – ***default value is the negative version of `from`***

### Spotlight
Rotates like a spotlight.

###### *Dependencies*

- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenMax** and **BezierPlugin** modules

Note that the **TweenMax** module includes the **TweenLite** one *– see [GSAP](http://www.greensock.com) documentation for details*.

###### *Examples*
*Example 1*

	animation: AvalonAnimation.Spotlight()
	
*Example 2*

	animation: AvalonAnimation.Spotlight({
      duration: 5,
      direction: 'ccw',
      angle: 10
    })

###### *Options*

- duration *(seconds)* – ***default value is 8***
- direction `'cw'` *(clockwise)* or `'ccw'` *(counter-clockwise)* – ***default value is 'cw'***
- angle – ***default value is 20***

# SpeedTester utility
The **SpeedTester** *(SpeedTester.min.js)* allows you to check system performance before activating **Avalon(A)**, thus preventing to undermine the usability of your website. It is meant to be used with the file `speed-benchmark.min.js` like this:

*Main html document – preferably before loading any other scripts*

	<script>
    	var speedTester = new SpeedTester(< path/to/speed-benchmark.min.js >);
    	speedTester.run();
	</script>

*Main script – after document as been loaded*

	speedTester.oncomplete(function(message){
		if(message.speed === 'high'){
			AvalonA('frame-3d', 'avalona-inner-frame').start();
		}
	});

# Browser compatibility
- Safari
- Chrome
- Firefox

*Nothing happens on browsers that doesn't support 3d transform.*

# Preview
**[see jsFiddle preview](http://jsfiddle.net/K3kPx/4/show)**