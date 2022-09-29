

module.exports = {

  options: {
    sourceMap: true,
    presets: ['@babel/preset-env']
  },

  default: {
    files: [{
      expand: true,
      cwd: 'js/',
      src: '*.js',
      dest: 'js/babel/'
    }]
  },


};