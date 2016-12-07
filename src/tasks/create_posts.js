(function () {

  'use strict';

  const get_filenames = (grunt) => {
    var filenames = []

    grunt.file.recurse('./src/contents', function(a, b, c, filename) {
      filenames.push(filename)
    })

    return filenames
  }

  module.exports = function (grunt) {


    grunt.registerTask('create_posts', 'Create HTML posts.', function () {
      const filenames = get_filenames(grunt)
      console.log(filenames)
    })
  }




}())
