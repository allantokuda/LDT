module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/assets/javascripts/jquery-1.9.1.js',
      'app/assets/javascripts/jquery-ui-1.10.3.js',
      'app/assets/javascripts/angular/angular.js',
      'app/assets/javascripts/angular/angular-*.js',
      'app/assets/javascripts/underscore.js',
      'app/assets/javascripts/d3.v3.js',
      'test/lib/angular/angular-mocks.js',
      'app/assets/javascripts/app.js',
      'app/assets/javascripts/services.js',
      'app/assets/javascripts/filters.js',
      'app/assets/javascripts/directives.js',
      'app/assets/javascripts/controllers/*.js',
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

})}
