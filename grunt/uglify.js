
module.exports = {

  options: {
    compress: true,
    // sourceMap: true
  },

  default: {
    //dynamic files
    expand: true,
    cwd: 'js/browserify/',
    src: ['*.js'],
    dest: 'js/jsmin/',
    ext: '.min.js',
  },


};