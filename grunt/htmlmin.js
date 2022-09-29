

module.exports = {
  options: {
    removeComments: true,
    collapseWhitespace: true
  },

  default: {
    files: [{
      expand: true,
      cwd: 'includes/',
      src: '*.html',
      dest: 'htmlmin/'
    }]
  },

};