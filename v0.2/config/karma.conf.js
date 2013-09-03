module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'app/lib/jquery.js',
      'app/lib/jquery-ui.js',
      'app/lib/angular/angular.js',
      'app/lib/angular/angular-*.js',
      'app/lib/underscore.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/**/*.js',
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
