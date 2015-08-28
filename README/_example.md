# <a name="dependencies"></a> Dependencies
- [GSAP 1.9.2+](http://www.greensock.com) *(GreenSock Animation Platform)* **TweenLite** and **CSSPlugin** modules

# <a name="example"></a> Example
## <a name="html"></a> Html
```html
    <div id="frame-3d"> <!-- 3d Frame -->
        <div id="avalona-inner-frame"> <!-- transformed layer -->
            <div id="half-circle" data-avalonA-transform="z:-300"></div>
                <div id="square" data-avalonA-transform="z:75; rx:20.32; ry:5; rz:-10.2">
                    <div id="inner-square" data-avalonA-transform="z:150"></div>
                </div>
            <div id="circle" data-avalonA-transform="x:100; y:150; z:200;rx:45"></div>
        </div>
    </div>
```

It is mandatory to have at least the `3d Frame` and `transformed layer` defined when **Avalon(A)** initialization occurs. Within the `3d Frame`, the element div having the id `avalona-inner-frame` becomes the `transformed layer`.

`data-avalonA-transform` attribute value has the following structure:

**z: z translation; rx: x rotation; ry: y rotation; rz: z rotation**

All properties are optional.

## <a name="script"></a> Script
``` js
    $(function(){
        AvalonA('frame-3d', 'avalona-inner-frame').start();
    });
```