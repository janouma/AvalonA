# <a name="speedTesterUtility"></a> SpeedTester utility
The **SpeedTester** *(SpeedTester.min.js)* allows you to check system performance before activating **Avalon(A)**, thus preventing to undermine the usability of your website. It is meant to be used like this:

*Main html document – preferably before loading any other scripts*

``` html
	<script>
    	var speedTester = new SpeedTester(< how many times the test must be run (default 1) >);
    	speedTester.run();
	</script>
```

*Main script – after document as been loaded*

``` js
	speedTester.oncomplete(function(results){
		if(results.fps > 30){
			AvalonA('frame-3d', 'avalona-inner-frame').start();
		}else{
			console.warn('Your frame rate is too low, recommended: 30');
		}
	});
```

# <a name="browserCompatibility"></a> Browser compatibility
- Safari
- Chrome
- Firefox

*Nothing happens on browsers that doesn't support 3d transform.*

# <a name="usingRequireJS"></a> Using it with require.js
**Avalon(A)** is AMD compliant: if **require.js** is present, `AvalonA` function won't be exposed as a global variable but as a module having the same name.
The same goes for `AvalonAnimation` plugin and `SpeedTester` utility.

As an AMD module, `AvalonA` requires `jquery` and `tweenlite` modules. `AvalonAnimation` requires `tweenmax`,`tweenlite` and `GSEases`modules, where `GSEases` contains key/value pairs of standard greensock easing functions — *the ones bundled with TweenMax*.

#### GreenSock specifics
Keep in mind that since GreenSock bundles several modules within one file — *indeed TweenMax file contains TweenMax as well as TweenLite, CSSPlugin, BezierPlugin, Eeasin, etc* — it needs special care to be used with **require.js**.

Check out this [code sample](https://raw.github.com/janouma/AvalonA/master/dist/avalona-amd-test.zip) to understand how to use **Avalon(A)** and **GreenSock** with **require.js**.


# <a name="preview"></a> Preview
**[see jsFiddle preview](http://jsfiddle.net/K3kPx/9/show)**