(function () {

  'use strict';

  module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json')
    });

    grunt.task.loadTasks('./src/tasks');
    grunt.registerTask('default', ['create_posts']);
  }
}())
