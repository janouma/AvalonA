# Avalon(A) — Bring deepness to your web apps

*version: 0.3.0*


**Avalon(A)** allows you to easily add 3d to a set of html elements in a way that simulates a deepness effect *([see jsFiddle preview](http://jsfiddle.net/K3kPx/1))*. To make this 3d effect noticeable, all html elements pertaining to the "3d frame" *(basically the root container to which the 3d effect get applied to)* - rotate on their x and y axis according to mouse movements.

# Dependencies
- [Zepto.js 1.0+](http://zeptojs.com) or [jQuery 1.9.1+](http://jquery.com)
- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenLite** and **CSSPlugin** modules

# Example
## Html
	<div id="frame-3d"> <!-- 3d Frame -->
    	<div class="avalona-inner-frame"> <!-- rotated layer -->
        	<div id="half-circle" data-avalonA-deepness="-300"></div>
        		<div id="square" data-avalonA-deepness="75">
            		<div id="inner-square" data-avalonA-deepness="150"></div>
        		</div>
        	<div id="circle" data-avalonA-deepness="200"></div>
    	</div>
	</div>

It is mandatory to have at least the "3d Frame" and "rotated layer" as a basic structure. Within the "3d Frame", the first child div having the class **avalona-inner-frame** becomes the "rotated layer".

## Script
    $(function(){
        AvalonA('frame-3d');
    });

# Browser compatibility
- Safari
- Chrome
- Firefox

*In browsers that doesn't support 3d transform, html elements stays simply flat.*

# Preview
**[see jsFiddle preview](http://jsfiddle.net/K3kPx/1)**