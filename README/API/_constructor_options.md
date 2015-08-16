# <a name="api"></a> API
## <a name="constructorOptions"></a> Constructor options
It is possible to pass an object along with the id of the `3d Frame` to set options:

    $(function(){
        AvalonA('frame-3d', 'avalona-inner-frame', {option: value}).start();
    });

##### *tAttr*
Changes the name of the attribute used to define layer **transformations**. Default value is `data-avalonA-transform`.

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