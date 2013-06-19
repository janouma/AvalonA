# Avalon(A) — Bring deepness to your web apps

*version: 0.6*


**Avalon(A)** allows you to easily add 3d to a set of html elements to simulate a deepness effect *([see jsFiddle preview](http://jsfiddle.net/K3kPx/2))*. To make this 3d effect noticeable, all html elements pertaining to the `transformed layer` *(basically the root container to which the 3d effect get applied to)* - rotate on their x and y axis according to mouse movements.

# Dependencies
- [Zepto.js 1.0+](http://zeptojs.com) or [jQuery 1.9.1+](http://jquery.com)
- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenLite** and **CSSPlugin** modules

# Example
## Html
	<div id="frame-3d"> <!-- 3d Frame -->
    	<div class="avalona-inner-frame"> <!-- transformed layer -->
        	<div id="half-circle" data-avalonA-deepness="-300"></div>
        		<div id="square" data-avalonA-deepness="75">
            		<div id="inner-square" data-avalonA-deepness="150"></div>
        		</div>
        	<div id="circle" data-avalonA-deepness="200"></div>
    	</div>
	</div>

It is mandatory to have at least the `3d Frame` and `transformed layer` defined when **Avalon(A)** initialization occurs. Within the `3d Frame`, the first child div having the class `avalona-inner-frame` becomes the `transformed layer`.

## Script
    $(function(){
        AvalonA('frame-3d').start();
    });

# API
## Constructor options
It is possible to pass an object along with the id of the `3d Frame` to set options:

    $(function(){
        AvalonA('frame-3d', {option: value}).start();
    });

##### *class*
Changes the name of the class used to tag an element as the `transformed layer`. Default value is `avalona-inner-frame`.

##### *zAttr*
Changes the name of the attribute used to define layer **z translation**. Default value is `data-avalonA-deepness`.

##### *fy*
A function that affects the amount of rotation triggered by the mouse movements on the **y axis**.

	AvalonA('frame-3d',{fy: function(rotation){
		return rotation * 2;
	} }).start();

Default function as no effect on the rotation value.

##### *fx*
A function that affects the amount of rotation triggered by the mouse movements on the **x axis**. Default function as no effect on the rotation value.

##### *activeArea*
When available, restrict mouse movements tracking to this area: moving outside the area reset the `transformed layer` rotation.

	options = {
		activeArea: {
			position: {
				x: 'auto',
				y: '15%'
			},
			attachement: 'scroll',
			width: '150px'
			height: 100
		}
	};
	AvalonA('frame-3d', options).start();

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


##### *debug*
Enable debug logs and display when set to `true`.

## Methods
##### *start()*
Fetch `3d Frame` and `transformed layer` from the DOM and apply initial setup.

##### *refresh()*
Alias for ***start()***.

##### *zRefresh( [target : selector OR html node] )*
Update **z translation** according to new values of `data-avalonA-deepness`.
When **target** is provided, only matching html nodes get updated.

# Browser compatibility
- Safari
- Chrome
- Firefox

*In browsers that doesn't support 3d transform, html elements stays simply flat.*

# Preview
**[see jsFiddle preview](http://jsfiddle.net/K3kPx/2)**