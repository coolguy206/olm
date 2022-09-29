

module.exports = {

  options: {
    livereload: true
  },


  default: {
    files: ['css/*.less', '*.html', 'js/*.js'],
    tasks: ['less', 'babel', 'browserify', 'uglify'],
  },


};