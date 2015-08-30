## <a name="properties"></a> Properties
##### <a name="layers"></a> *layers*
Provides all nodes picked up while running `start()` or `refresh()` or `enable()` method.
It has the following structure:

``` js
{
	"#<layer-id-1>": <Layer>,
	"#<layer-id-2>": <Layer>,
	...
	".<layer-class-1>": <Layer>[],
	".<layer-class-2>": <Layer>[],
	...
	all: <Layer>[]
}
```

The **layers** property references all transformed html elements by their ids *(#layer-id)*, their css classes *(.layer-class)* and
all elements are also referenced under `all`, including those not having neither id nor class attribute.

Each html element is wrapped by a `Layer` object — *private to the lib, meaning you can't directly instanciate one* — so that it is more convenient to manipulate transform properties.

The `Layer` instance has the following properties:

- `node` – the raw html node
- `x` – get/set the translateX style of the node
- `y` – get/set the translateY style of the node
- `z` – get/set the translateZ style of the node
- `rx` – get/set the rotateX style of the node
- `ry` – get/set the rotateY style of the node
- `rz` – get/set the rotateZ style of the node
- `ox` – get/set the x origin transform style of the node
- `oy` – get/set the y origin transform style of the node
- `oz` – get/set the z origin transform style of the node

The node style get updated – *according to the x, y, z, ... getter/setter* – only after calling either
`refreshTransform` method *([see `refreshTransform()`](#refreshTransform))* or `<Layer>.refresh()`.
Calling `refreshTransform` with no **node** argument also update the layers property: so if transformations has been added to a new node,
this one will also end up as a `Layer` in the `layers` field.

The `Layer` instance has the following methods:

- `refresh()` – to actually apply transformations

- `transform({[x:<x value>], [y:<y value>], [z:<z value>], ...})` – to set several transformations at once