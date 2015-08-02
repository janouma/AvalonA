AvalonA('t3d-frame', 't3d-layer', {
	tAttr:'transform',
	fx: function fx(rotation){return rotation * 0.5;},
	fy: function fy(rotation){return rotation * 0.15;},

	animation: AvalonAnimation.Atom({
		duration: 10,
		selector: '.gravity',
		axis: ['z']
	}),

	/*activeArea:{
		attachment: 'scroll',
		width: '75%',
		height: 350
	},*/

	debug: true
}).enable();