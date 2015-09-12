define(['photos', 'FrameTimer'], function definePhotoLoader(photos, FrameTimer){
	return {

		init: function init(pages){
			photos.slice(0, pages.length).forEach(function setPhoto(photo, index){
				pages[index].src = photo.file;
			});
		}

	};
});