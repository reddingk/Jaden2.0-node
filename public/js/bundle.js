(function () {
	"use strict";

		angular.module('dataconfig', []);
		angular.module('directives', []);
		angular.module('headerCtrl', ['ui.bootstrap']);
    angular.module('homeCtrl', ['ui.bootstrap']);

    angular.module('JadenApp', ['ngMaterial','ngAnimate', 'ui.router','directives', 'config', 'dataconfig', 'headerCtrl','homeCtrl']);

})();

  (function(){
   "use strict";

    angular.module('headerCtrl').controller('HeaderController', ['$state', 'jadenInfo', function($state, jadenInfo){
      var vm = this;
      /*Functions*/
      vm.checkActivePage = checkActivePage;
      vm.selectChip = selectChip;

      /*Variables*/
      vm.chips = jadenInfo.chips.all();
      vm.selected = null;

      function checkActivePage(current) {
			     var currentPage = $state;
           if (currentPage != null && currentPage.current.name.indexOf(current) > -1) { return true; }
			     else { return false; }
		  }

      function selectChip(newstate) {
        $state.go(newstate.link);
      }

    }]);

})();

(function(){
   "use strict";

    angular.module('homeCtrl').controller('HomeController', ['$state', 'jadenInfo', function($state, jadenInfo){
      var vm = this;
      /*Functions*/
      vm.getChipsWithColor = getChipsWithColor;
      vm.changeFocus = changeFocus;

      /*Variables*/
      vm.title = "Home";
      vm.chips = null;

      /*Start up functions*/
      vm.getChipsWithColor();

      function getChipsWithColor() {
        var tmpchips = jadenInfo.chips.all();
        var colorArray = randomColor({ count: tmpchips.length + 1, luminosity: 'bright', format: 'rgb'});

        for(var i =0; i < tmpchips.length; i++) {
          tmpchips[i].color = colorArray[i];
        }
        vm.chips = tmpchips;
      };

      function changeFocus(newstate) {
        $state.go(newstate);
      }

    }]);

})();

(function(){
  'use strict';

  angular.module('config', [ 'ngMaterial' ]);

})();

(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('jadenInfo', [ 'jadenData', '$filter', function RedInfo(jadenData, $filter){
      var chips = jadenData.app_chips;

      return {
        chips: {
          all: function(){
            return chips;
          }
        }
      }
    }])
    .factory("jadenData", ['$q', '$http', function($q, $http){
     function JadenInfoData() {
       var vm = this;
       //TEST
       var date = new Date();
       var d = date.getDate();
       var m = date.getMonth();
       var y = date.getFullYear();

       /*App Chips*/
       /*{"title":"TITLE", "icon":"FONT AWESOME ICON", "span":[h,w], "link":"INSIDE APP LINK"}*/
       vm.app_chips = [
         {"id":1, "title":"Settings", "icon":"fa-cog", "span":[1,1], "link":"app.construction"},
         {"id":2, "title":"Social", "icon":"fa-users", "span":[2,2], "link":"app.construction"},
         {"id":3, "title":"Camera", "icon":"fa-camera", "span":[1,1], "link":"app.construction"},
         {"id":4, "title":"Google Tools", "icon":"fa-google", "span":[1,1], "link":"app.construction"},
         {"id":5, "title":"Dinner Time", "icon":"fa-cutlery", "span":[2,2], "link":"app.construction"}
       ];

     }

     return new JadenInfoData();
    }]);

})();

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
      }).state('app.construction', {
        url: "underconstruction",
        views: {
          'content@': {
            templateUrl: 'views/construction.html'
          }
        }
      });


      $urlRouterProvider.otherwise('/');
      //$locationProvider.html5Mode(true);
    }]);


})();

(function(){
   "use strict";

    angular.module('directives').directive('navHold', ['$window', function($window) {
      return {
        restrict: 'EA',
        link: function ($scope, element, attrs) {

          angular.element($window).bind("scroll", function() {

            var topSection = angular.element(document.getElementsByClassName("mainBody"))[0];
            var windowp = angular.element($window)[0];
            var topThreshhold = topSection.offsetTop - element[0].clientHeight

            if(windowp.pageYOffset >= topThreshhold){
              if(!element.hasClass("screenPass")){
                element.addClass("screenPass");
              }
            }
            else {
              if(element.hasClass("screenPass")){
                element.removeClass("screenPass");
              }
            }

          });
        }
      }

    }]);

})();
