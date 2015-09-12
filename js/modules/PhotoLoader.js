define(['photos', 'FrameTimer'], function definePhotoLoader(photos, FrameTimer){
	return {

		_pageIndex: 0,

		_photoIndex: 0,

		_firstLoad: true,


		_load: function _load(){
			var pages = this._pages;
			var descriptions = this._descriptions;

			pages[this._pageIndex].src = this._loader.src;

			descriptions[this._pageIndex].textContent
				= photos[this._photoIndex].description;

			this._pageIndex = (this._pageIndex + 1) % pages.length;
			this._photoIndex = (this._photoIndex + 1) % photos.length;

			if( ! this._firstLoad ){
				Object.create(FrameTimer).after(this._frames).run(this._next.bind(this));
			}else{
				this._next();
			}

			this._firstLoad = this._firstLoad && this._pageIndex !== 0;
		},


		_next: function _next(){
			this._loader.src = photos[this._photoIndex].file;
		},


		init: function init(pages, descriptions, frames){
			this._pages = pages;
			this._descriptions = descriptions;
			this._frames = frames || 600;
			this._loader = new Image();
			this._loader.addEventListener('load', this._load.bind(this));
			this._next();
		}

	};
});