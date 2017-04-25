import Ember from 'ember';
import layout from '../templates/components/image-cropper';

const DEFAULT_ROTATE_DEGREE = 45;
const DEFAULT_ZOOM_RATIO = 0.1;
const { computed } = Ember;

export default Ember.Component.extend({
  layout,

  classNames: ['image-cropper'],
  
  // Properites exposed 
  //aspectRatio: undefined,

  binaryData: null,

  url: null,

  minHeight: 0,

  minWidth: 0,

  mimeType: null,

  onCropped: null, 

  // Internal properties
  imageData: computed.or('binaryData', 'url'),

  hasImageData: computed.notEmpty('imageData'),

  isWidthUndersized: computed('croppedWidth', 'minWidth', function() {
    return this.get('croppedWidth') < this.get('minWidth');
  }),

  isHeightUndersized: computed('croppedHeight', 'minHeight', function() {
    return this.get('croppedHeight') < this.get('minHeight');
  }),

  init() {
    this.setProperties({
      /* 
      * Set options for Cropper plugin
      * for additional options, check https://github.com/fengyuanchen/cropper
      * If you need more options, set them here and pass them to the plugin in init()
      */
      aspectRatio: 1,
      checkCrossOrigin: false,
      viewMode: 1,
      /*
      * Set default properties for this component
      */
      mimeType: 'image/jpeg',
      imageSelector: '.cropper-target',
      croppedImageData: null,
      scaleX: 1,
      scaleY: 1,
      croppedWidth: 0,
      croppedHeight: 0,
      errorMessage: null,
    })

    this._super(...arguments);
  },

  didInsertElement() {
    let self = this;
    
    // initialize cropper
    this.$(this.get('imageSelector')).cropper({
      aspectRatio: this.get('aspectRatio'),
      checkCrossOrigin: this.get('checkCrossOrigin'),
      viewMode: this.get('viewMode'),
      crop(e) {
        self.afterCrop(e);
      }
    })
  },

  willDestroyElement() {
    this.$(this.get('imageSelector')).cropper('destroy');
  },

  afterCrop(event) {
      this.setProperties({
        croppedWidth: Math.floor(event.width),
        croppedHeight: Math.floor(event.height)
      })
  },

  actions: {
    setDragMode(mode) {
      this.$(this.get('imageSelector')).cropper('setDragMode', mode);
    },

    rotate(isClockwise) {
      this.$(this.get('imageSelector')).cropper('rotate', isClockwise ? DEFAULT_ROTATE_DEGREE : -DEFAULT_ROTATE_DEGREE);
    },

    flip(isAbscissa){
      let scale = `scale${isAbscissa ? 'X' : 'Y'}`;

      this.$(this.get('imageSelector')).cropper(scale, -this.get(scale));
      this.set(scale, -this.get(scale));
    },

    zoom(isZoomIn) {
      this.$(this.get('imageSelector')).cropper('zoom', isZoomIn ? DEFAULT_ZOOM_RATIO : -DEFAULT_ZOOM_RATIO);
    },

    getCroppedImageData() {
      if (this.get('isWidthUndersized') || this.get('isHeightUndersized')) {
        this.set('errorMessage', 'The resolution of the cropped image is too small.');

        return;
      }
      
      this.set('errorMessage', null);

      if(!Ember.isEmpty(this.get('onCropped'))) {
        let data = this.$(this.get('imageSelector')).cropper('getCroppedCanvas').toDataURL(this.get('mimeType'));

        this.sendAction('onCropped', data);
      }
    }
  }
});
