/* jshint node: true */
'use strict';

// var merge = require('broccoli-merge-trees');

// var path = require('path');

module.exports = {
  name: 'ember-cli-image-cropper',

  // treeForVendor() {
  // 	var tree = this._super.apply(this.arguments);

  // 	try {
  // 		var cropper = path.dirname(require.resolve('cropper'));

		// return merge([].concat(tree || [], cropper));
  // 	}
  // 	catch (err) {
  // 		console.log(err);
  // 	}

  // 	return merge([].concat(tree || []));
  // },

  // included() {
  // 	this._super.apply(this.arguments);

  // 	this.import('vendor/cropper.js');
  // 	this.import('vendor/cropper.css');
  // }

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import(app.bowerDirectory + '/cropper/dist/cropper.js');
    app.import(app.bowerDirectory + '/cropper/dist/cropper.css');
  }
};
