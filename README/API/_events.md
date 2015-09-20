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
Triggered ONLY ONCE by `start()` or `enable()` BEFORE transformations gets actually applied.

##### *refresh*
Triggered every time by `refresh()` or `refreshTransform()` AFTER transformations has been applied.

##### *enable*
Triggered every time Avalon(A) gets "enabled" – *by `enable()`* – AFTER transformations has been applied.

If Avalon(A) was already "enabled" by the time `enable()` gets called, the event is not triggered again.

##### *start*
Alias for `enable` event.
