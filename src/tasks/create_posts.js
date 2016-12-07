/*global module, require*/
(function () {

  'use strict';

  const get_filenames = (grunt) => {
    var filenames = [];

    grunt.file.recurse('./src/contents', function(a, b, c, filename) {
      filenames.push(filename)
    });

    return filenames
  };

  const create_post_title = (filename) => {
    const title = filename.substring(0, filename.indexOf('.md')).replace(/_/g, " ");

    return `${title.charAt(0).toUpperCase()}${title.slice(1)}`
  };

  const create_html_name = (filename) => {
    return `${filename.substring(0, filename.indexOf('.md'))}.html`.toLocaleLowerCase()
  };

  const create_logo = (filename) => {
    return `${filename.substring(0, filename.indexOf('.md'))}.png`.toLocaleLowerCase()
  };

  const create_post = (grunt, filename) => {
    const showdown          = require('showdown');
    const converter         = new showdown.Converter({'tables': true});
    const markdown_content  = grunt.file.read(`./src/contents/${filename}`, [null, {encoding: 'utf8'}]);
    const html_content      = converter.makeHtml(markdown_content);

    const Handlebars        = require('handlebars');
    const hbs               = grunt.file.read('./src/templates/post.hbs', [null, {encoding: 'utf8'}]);
    const template          = Handlebars.compile(hbs);

    const summary_markdown  = grunt.file.read(`./src/summaries/${filename}`, [null, {encoding: 'utf8'}]);
    const summary_content   = converter.makeHtml(summary_markdown);

    const html = template({
      title: create_post_title(filename),
      description: summary_content,
      html_name: create_html_name(filename),
      logo: create_logo(filename),
      date_published: new Date().toISOString(),
      date_modified: new Date().toISOString(),
      content: html_content,
      url: `http://guido-barbaglia.blog/posts/${create_html_name(filename)}`
    });

    grunt.file.write(`./posts/${create_html_name(filename)}`, html, [null, {encoding: 'utf8'}]);
  };

  module.exports = function (grunt) {
    grunt.registerTask('create_posts', 'Create HTML posts.', function () {
      const filenames = get_filenames(grunt);
      for (var filename of filenames) {
        create_post(grunt, filename)
      }
    })
  }
}());
