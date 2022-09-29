
module.exports = {

  default: {
    files: [{
      expand: true,
      cwd: 'js/babel/',
      src: '*.js',
      dest: 'js/browserify/'
    }]
  },

};