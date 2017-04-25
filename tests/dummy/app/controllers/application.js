import Ember from 'ember';

export default Ember.Controller.extend({

	actions: {
		setCroppedImage(data) {
			this.set('croppedImage', data);
		}
	}

});
