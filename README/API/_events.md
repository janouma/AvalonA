## <a name="events"></a> Events
It is possible to add event listeners like this

``` js
var options = {
	on: {
		event: function(){ /* event code goes here */ },
	}
};
AvalonA('frame-3d', 'avalona-inner-frame', options).start();
```

or this

``` js
var a = AvalonA('frame-3d', 'avalona-inner-frame', options);
a.onevent = function(){ /* event code goes here */ };
a.start();
```

Available events:

##### *startrotation*
Triggered when `transformed layer` rotation starts.

##### *endrotation*
Triggered when `transformed layer` rotation ends.

##### *ready*
Triggered ONLY ONCE by `start()`, `refresh()` or `enable()` BEFORE transformations gets actually applied.

##### *refresh*
Triggered every time by `start()`, `refresh()` or `enable()` AFTER transformations has been applied.

##### *start*
Alias for `refresh` event.

##### *enable*
Alias for `refresh` event.