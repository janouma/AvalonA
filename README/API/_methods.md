## <a name="methods"></a> Methods
##### *refresh()*
Fetch `3d Frame` and `transformed layer` from the DOM and apply initial setup.

Return **layers** *([see **layers** property](#layers))*.

##### *start()*
Alias for ***refresh()***.

##### *enable()*
Alias for ***refresh()***.

##### *disable()*
Flatten `transformed layer`, remove mouse movement tracking, unable events and pause animation.

##### <a name="refreshTransform"></a> *refreshTransform( [target : selector OR html node] )*
Update **transformations** according to new values of `data-avalonA-transform`.
When **target** is provided, only first matching html node get updated.