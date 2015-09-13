define(['photos', 'FrameTimer'], function definePhotoLoader(photos, FrameTimer){
	return {

		_pageIndex: 0,

		_photoIndex: 0,

		_loadCount: 0,


		_descriptionAttribute: 'data-description',


		_loadOne: function _loadOne(index){
			var loader = this._loaders[index];
			this._pages[index].src = loader.src;
			this._descriptions[index].textContent = loader[this._descriptionAttribute];
		},


		_loadAll: function _loadAll(){
			if(++this._loadCount === this._loaders.length){
				this._loadCount = 0;
				Object.create(FrameTimer).after(this._frames).run(this._next.bind(this));
			}
		},


		_next: function _next(){
			this._loaders.forEach(function loadPhoto(loader){
				var nextPhoto = this._getNextPhoto();
				loader.src = nextPhoto.file;
				loader[this._descriptionAttribute] = nextPhoto.description;
			}.bind(this));
		},


		_getNextPhoto: function _getNextPhoto(){
			var nextPhoto = photos[this._photoIndex];
			this._photoIndex = (this._photoIndex + 1) % photos.length;
			return nextPhoto;
		},


		init: function init(pages, descriptions, frames){
			var loaders = this._loaders = [];
			var loader;

			this._pages = pages;
			this._descriptions = descriptions;
			this._frames = frames || 600;

			for(var index = pages.length; index--;){
				loader = new Image();
				loader.addEventListener('load', this._loadOne.bind(this, index));
				loader.addEventListener('load', this._loadAll.bind(this));
				loaders.unshift(loader);
			}

			this._next();
		}

	};
});