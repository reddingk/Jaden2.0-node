(function(){

  angular
    .module('config')
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
      .state('app', {
        url: "/",
        views: {
          'content':{
            templateUrl: 'views/home.html',
            controller: 'HomeController as hc'
          },
          'header':{
            templateUrl: 'views/templates/_header.html',
            controller: 'HeaderController as hdc'
          }
        }
      })
      .state('app.jada', {
        url: "jada",
        views: {
          'content@': {
            templateUrl: 'views/jada.html',
            controller: 'JadaController as jc'
          }
        }
      })
      .state('app.construction', {
        url: "underconstruction",
        views: {
          'content@': {
            templateUrl: 'views/construction.html'
          }
        }
      })
      /*Chip views*/
      .state('app.mediaSuggestions', {
        url: "mediaSuggestions",
        views: {
          'content@': {
            templateUrl: 'views/chipviews/mediaSuggestions.html',
            controller: 'MediaSuggestionsController as cc'
          }
        }
      });


      $urlRouterProvider.otherwise('/');
      //$locationProvider.html5Mode(true);
    }]);


})();
