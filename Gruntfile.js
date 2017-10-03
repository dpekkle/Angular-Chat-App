module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-karma');  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Project configuration.
  grunt.initConfig(
  {
    karma: {
        unit: {
            configFile: 'karma.conf.js'
        }
    },
    concat: {
      options: {
        separator: ';',
      },
      build: {
        src: ['src/web-chat.js', 'src/extra.js', 'src/controllers/*.js', 'src/components.js'],
        dest: 'src/compiled/client-concat.js'
      },
      server: {
        src: ['src/server/server-source.js', 'src/server/server-utils.js'],
        dest: 'src/compiled/server-concat.js'
      }
    },    
    "babel" : 
    {
      options: 
      {
        sourceMap: false,
        presets: ['es2015']
      },
      build: 
      {
        files: 
        {
          "dist/client-<%= pkg.name %>.js": "src/compiled/client-concat.js",
        }
      },
      server:
      {
        files:
        {
          "server-<%= pkg.name %>.js" : "src/compiled/server-concat.js"
        }
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/compiled/babeled.js',
        //src: ['src/*-compiled.js', 'src/extra.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });


  // Tasks definitions
  grunt.registerTask("build", ["concat:build", "babel:build", "concat:server", "babel:server"]);
  grunt.registerTask("test", ["karma"]);
  grunt.registerTask("default", "build");
  grunt.registerTask("client", ["concat:build", "babel:build"]);
  grunt.registerTask("server", ["concat:server", "babel:server"]);
};