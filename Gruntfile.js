module.exports = function(grunt) {

      // Project configuration.
      grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

          sass: {                              // Task
            dist: {                            // Target
              options: {                       // Target options
                style: 'expanded'
              },
              files: {                         // Dictionary of files
                'css/dots.css': 'scss/dots.scss',  // 'destination': 'source'
              }
            }
          },

          connect: {
            livereload: {
                options: {
                    port: 4440,
                    open: true,
                }
            }
          },

          watch: {
            scss: {
                files: 'scss/*.scss',
                tasks: ['sass'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: 'css/*.css',
                options: {
                    livereload: true
                }
            },
            scripts: {
                files: ['js/*.js','KeywordAndPaging/*.js', 'RubiksCubeViz/*.js', 'StackedAreaChart/*.js', 'testStacked/*.js'],
                options: {
                    livereload: true
                }
            },
            pageStuf: {
                files: ['*.html', 'RubiksCubeViz/*.html', 'StackedAreaChart/*.html', 'StickyHeaders/*.html'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    open: true,
                    livereload: '<%= connect.options.livereload %=>'
                },
                files: ['css/*.css', 'js/*.js']
            }
          },

      });

      // Load the plugin that provides the "uglify" task.
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-watch');
      grunt.loadNpmTasks('grunt-contrib-connect');
      grunt.loadNpmTasks('grunt-contrib-sass');

      // Default task(s).
      grunt.registerTask('default', ['connect', 'watch']);
      grunt.registerTask('sass', 'sass');

};
