module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'vendor/assets/javascripts/jquery-1.9.1.js',
      'vendor/assets/javascripts/jquery-ui-1.10.3.js',
      'vendor/assets/javascripts/angular/angular.js',
      'vendor/assets/javascripts/angular/angular-*.js',
      'vendor/assets/javascripts/underscore.js',
      'test/lib/angular/angular-mocks.js',
      'app/assets/javascripts/app.js',
      'app/assets/javascripts/directives.js',
      'app/assets/javascripts/controllers/*.js',
      'app/assets/javascripts/models/*.js',
      'test/unit/**/*.js',
      'test/lib/jasmine-jquery.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

    });
};
