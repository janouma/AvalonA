[
	'lightfx',
	'black-hole'
].forEach(function loadHdImage(imageBasename){
	var imageExtension = '.png';
	var sdImageFile = imageBasename + '-sd' + imageExtension;
	var hdImagePath = 'images/' + imageBasename + imageExtension;
	var imageElement = new Image();

	imageElement.addEventListener(
		'load',
		function onImageLoad(){
			var elementList = document.querySelectorAll('img[src$="'+sdImageFile+'"]');
			Array.prototype.slice.call(elementList)
				.forEach(function updateSrc(element){
					element.src = hdImagePath;
				});
		},
		false
	);

	imageElement.src = hdImagePath;
});


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