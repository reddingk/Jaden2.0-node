(function () {
	"use strict";

		angular.module('dataconfig', []);
		angular.module('directives', []);
		angular.module('headerCtrl', ['ui.bootstrap']);
    angular.module('homeCtrl', ['ui.bootstrap']);
		angular.module('jadaCtrl', ['ui.bootstrap']);
		/*Chip Ctrls*/
		angular.module('mediaSuggestionsCtrl', ['ui.bootstrap']);

		/**/
    angular.module('JadenApp', ['ngMaterial','ngAnimate', 'ui.router','directives', 'config', 'dataconfig', 'headerCtrl','homeCtrl', 'jadaCtrl', 'mediaSuggestionsCtrl']);

})();

(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('apiInfo', [ 'apiData', '$filter', '$q', '$http', function ApiInfo(apiData, $filter, $q, $http){
      var api_list = apiData.app_apis;

      return {
        list: {
          all: function(){
            return api_list;
          }
        },
        default: function() {
          var def = $q.defer();
          def.resolve("");
          return def.promise;
        },
        tastekid: {
          all_similar: function(query) {
            var api = apiData.getApiItem("tasteKid");
            if(api != null) {
              var api_url = api.link +"similar?q="+query+"&callback=JSON_CALLBACK&k="+api.key;
              var def = $q.defer();
              $http.jsonp(api_url)
              .success(function (data) {
                def.resolve(data);
              });
              return def.promise;
            }
            else
            { return null; }
          },
          type_similar: function(query, type, info) {
            var api = apiData.getApiItem("tasteKid");
            if(api != null) {
              var api_url = api.link +"similar?q="+query+"&callback=JSON_CALLBACK&k="+ api.key + (type != "all"? "&type="+type : "") + (info == 1 ? "&info=1":"");
              var def = $q.defer();
              $http.jsonp(api_url)
              .success(function (data) {
                def.resolve(data);
              });
              return def.promise;
            }
            else
            { return null; }

          }
        }
      }
    }])
    .factory("apiData", ['$q', '$http', function($q, $http){
     function ApiInfoData() {
       var vm = this;
       vm.app_apis = [
         {"name":"tasteKid", "link":"https://www.tastekid.com/api/","key":"228198-JadenPer-P426AN1R"}
       ];

       vm.getApiItem = function(name){
         var item = null;
         for(var i =0; i < vm.app_apis.length; i++) {
           if(vm.app_apis[i].name == name)
           { item = vm.app_apis[i]; }
         }
         return item;
       }
     }

     return new ApiInfoData();
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
    .service('jadenInfo', [ 'jadenData', '$filter', function JadenInfo(jadenData, $filter){
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
         {"id":5, "title":"Dinner Time", "icon":"fa-cutlery", "span":[2,2], "link":"app.construction"},
         {"id":6, "title":"Media Suggestions", "icon":"fa-ticket", "span":[1,1], "link":"app.mediaSuggestions"}
       ];

     }

     return new JadenInfoData();
    }]);

})();

(function(){
  'use strict';

  angular
    .module('dataconfig')
    .service('jBrainInfo', [ 'jBrain', 'apiInfo', '$filter', function BrainInfo(jBrain, apiInfo,  $filter){


      return {
        talk: {
          task: function(phrase){
            var response = jBrain.convo(phrase);

            return response;
          }
        }
      }
    }])
    .factory("jBrain", ['$q', '$http', 'apiInfo', function($q, $http, apiInfo){
     function JBrainData() {
       var vm = this;

       /*Functions*/
       vm.convo = convo;
       /*Main conversation function*/
       function convo(phrase){
         var str = phrase.split(" ");
         var responseFunction = null;
         /*Get phrase and resonse*/
         for(var i = 0; i < str.length; i++) {
           for(var j =0; j < vm.phraseLibrary.length; j++) {
             /*Found matching action phrase*/
             if(str[i].toLowerCase() == vm.phraseLibrary[j].action || (vm.phraseLibrary[j].additional_phrases != undefined && vm.phraseLibrary[j].additional_phrases.indexOf(str[i].toLowerCase()) > -1) ){
               if(responseFunction == null){
                 if(vm.phraseLibrary[j].subactions == null || i+1 >= str.length)
                 { responseFunction = vm.phraseLibrary[j]; }
                 else {
                  // check all sub actions and return responseFunction
                  var tmpResp = getSubActionResponse(str.slice(i, str.length), vm.phraseLibrary[j].subactions);
                  if(tmpResp == null){
                    if(vm.phraseLibrary[j].response != undefined)
                      responseFunction = vm.phraseLibrary[j];
                  }
                  else
                  { responseFunction = tmpResp; }
                 }
              }
             }
           }
         }
         // return function
         if(responseFunction == null)
         { return {"code":-1, "response": "Sorry I am not sure what you would like"};  }
         else
         { return Action(responseFunction, str) }
       }

       /*Recursive sub action check*/
       function getSubActionResponse(subPhrase, subactions) {

         for(var i = 0; i < subPhrase.length; i++) {
           for(var j =0; j < subactions.length; j++) {
             /*Found matching action phrase*/
             if(subPhrase[i].toLowerCase() == subactions[j].action) {
               if(subactions[j].subactions == null || i+1 >= subPhrase.length) {
                 return subactions[j];
               }
               else {
                 // check all sub actions and return responseFunction
                 return getSubActionResponse(subPhrase.slice(i, subPhrase.length), subactions[j].subactions);
               }
             }
             else if ( i+1 == subPhrase.length) {
               return null;
             }
           }
         }
       }

       function Action(responseFunction, strPhrase)
       {
         var response = null;
         var def = $q.defer();

         switch(responseFunction.response) {
          case "greetings":
            response = apiInfo.default().then(function(){
               return _greetings();
            });
            break;
          case "getLocalTime":
            response = apiInfo.default().then(function(){
              return _getLocalTime();
            });
            break;
          case "getTimeZoneTime":
            response = apiInfo.default().then(function(results) {
              return _getTimeZoneTime(responseFunction, strPhrase);
            });
            break;
          case "getTastekidResults":
            response = apiInfo.default().then(function(results) {
              return _getTastekidResults(responseFunction, strPhrase)
            });
            break;
          default:
            response = {"code":-2, "response": "Sorry I'm not sure what to do!!!"};
            break;
         }

         if(response == null)
         { return {"code":-22, "response": "Sorry Something went wrong!!!"}; }
         else
         { return response; }

       }


       /*
        PHRASE LIBRARY
        action: ACTION WORD
        response: RESPONSE FUNCTION
        additional_phrases: ADDITIONAL PHRASEING FOR SAME ACTION
        subactions: SUB ACTIONS UNDER SAME CATEGORY
       */
       vm.phraseLibrary = [
         {"action": "hello", "response":"greetings", "additional_phrases":["hi", "hey"]},
         {"action": "time", "response":"getLocalTime", "subactions":[ {"action":"in", "response":"getTimeZoneTime"}]},
         {"action": "similar", "subactions":[ {"action":"media", "subactions":[ {"action":"to", "response":"getTastekidResults"}]}]},
         {"action": "media", "subactions":[ {"action":"similar", "subactions":[ {"action":"to", "response":"getTastekidResults"}]}]}
       ];

       /* Library Functions*/
       function _greetings() {
         var result = {"code":1, "response": "Hey, Kris hows things treating you (I'm sure you will add more greetings soon)"};
         return result;
       }

       /*Get the local time*/
       function _getLocalTime() {
         var date = new Date();
         var h = (date.getHours() > 12 ? date.getHours() - 12 : date.getHours());
         var m = (date.getMinutes() < 10 ? "0"+ date.getMinutes() : date.getMinutes());
         var timeDelim = (date.getHours() > 12 ? "pm" : "am");
         var timeStr = "The time according to this machine is " + h + ":" + m +" " + timeDelim + " ";

         return {"code":1, "response": timeStr};
       }

       /*Get the time from a specific location*/
       function _getTimeZoneTime(responseFunction, strPhrase) {
         var res;
         if(strPhrase.indexOf(responseFunction.action) + 1 >= strPhrase.length)
           res = {"code":-2, "response": "Sorry no location given !!!"};
         else {
           var location = strPhrase.splice(strPhrase.indexOf(responseFunction.action) + 1, strPhrase.length);
           res = {"code":1, "response": "Still working on getting times from around the world and places like: " + location};
         }
         return res;
       }

       /*Get all similar media for a media item*/
       function _getTastekidResults(responseFunction, strPhrase) {
         var def = $q.defer();
         var media = strPhrase.splice(strPhrase.indexOf(responseFunction.action) + 1, strPhrase.length);

         var result = apiInfo.tastekid.all_similar(media.join("+")).then(function(results){
           var res;
           if(results == null) {
             res =  {"code":-2, "response": "Something is up with searching for: " + media.join("+")};
           }
           else if(results.Similar.Results.length == 0) {
             res =  {"code":0, "response": "Sorry there are no media suggestions for " + results.Similar.Info[0].Name + ", maybe you have the wrong title?"};
           }
           else {
             var itemList = "";
             var compList = "";
             console.log(results);
             for(var j =0; j < results.Similar.Info.length; j++) {
               compList += results.Similar.Info[j].Name +" (" + results.Similar.Info[j].Type +")";
               compList += (j+1 < results.Similar.Info.length ? " & " : "");
             }
             for(var j =0; j < results.Similar.Results.length; j++) {
               itemList += results.Similar.Results[j].Name +" (" + results.Similar.Results[j].Type +")";
               itemList += (j+1 < results.Similar.Results.length ? ", " : ".");
             }
             res =  {"code":1, "response": "According to Tastekid for " + compList +".  The following are sugguested that you checkout: " + itemList};
           }
           def.resolve(res);
           return def.promise;
         });
         return result;
       }

     }

     return new JBrainData();
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
   "use strict";

    angular.module('jadaCtrl').controller('JadaController', ['$state', '$q', 'jadenInfo', 'jBrainInfo', function($state, $q, jadenInfo, jBrainInfo){
      var vm = this;
      /*Functions*/
      vm.changeFocus = changeFocus;
      vm.textJada = textJada;
      vm.talkToJada = talkToJada;

      /*Variables*/
      vm.title = "Jada";
      vm.chips = jadenInfo.chips.all();
      vm.search="";
      vm.jadaResponse = [];


      vm.test = jBrainInfo.talk.task("What time is it right now in Chicago, Illinois");

      function changeFocus(newstate) {
        $state.go(newstate);
      }

      function textJada() {
        var def = $q.defer();
        var dialog = "";
        if(vm.search == null) {
          dialog = {"id":vm.jadaResponse.length+1 ,"user":vm.search, "response":"Hey just ask me something and I'll let you know whats up."}
          vm.jadaResponse.push(dialog);
          vm.search = null;
        }
        else {
          jBrainInfo.talk.task(vm.search).then(function(jresponse){
            if(jresponse.code < 0)
              console.log("Error Code: " + jresponse.code);

            dialog = {"id":vm.jadaResponse.length+1 ,"user":vm.search, "response":jresponse.response}
            vm.jadaResponse.push(dialog);
            vm.search = null;
          });
          //var jresponse = jBrainInfo.talk.task(vm.search);

        }
        //vm.jadaResponse.push(dialog);
        //vm.search = null;
      }

      function talkToJada() {

      }

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

(function(){
 "use strict";

  angular.module('mediaSuggestionsCtrl').controller('MediaSuggestionsController', ['$state', '$q', 'jadenInfo', 'jBrainInfo','apiInfo', function($state, $q, jadenInfo, jBrainInfo, apiInfo){
    var vm = this;

    /*Variables*/
    vm.title = "Media Suggestions";
    vm.chips = [];
    vm.chipMax = 8;
    vm.items = [{"name":"all", "icon":"fa-globe"},{"name":"movie", "icon":"fa-film"}, {"name":"show", "icon":"fa-television"}, {"name":"music", "icon":"fa-music"},{"name":"book", "icon":"fa-book"},{"name":"author", "icon":"fa-pencil-square-o"}, {"name":"game", "icon":"fa-gamepad"}];
    vm.selectedItem = vm.items[0];
    vm.search = "";
    vm.simResults = [];

    /*Functions*/
    vm.changeFocus = changeFocus;
    vm.changeType = changeType;
    vm.getSimilarMedia = getSimilarMedia;
    vm.getAdditionalChips = getAdditionalChips;
    /*Start up functions*/
    vm.getAdditionalChips();

    /*Functions*/
    function getAdditionalChips() {
      var tmpchips = jadenInfo.chips.all();
      var colorArray = randomColor({ count: vm.chipMax, luminosity: 'dark', format: 'rgb'});

      for(var i =0; i < tmpchips.length; i++) {
        if(tmpchips[i].title != vm.title && (i+1) <= vm.chipMax){
          tmpchips[i].color = colorArray[i];
          vm.chips.push(tmpchips[i]);
        }
      }
    }

    function changeFocus(newstate) {
      $state.go(newstate);
    }

    function changeType(item){
      console.log(item);
      vm.selectedItem = item;
    }

    function getSimilarMedia() {
      apiInfo.tastekid.type_similar(vm.search, vm.selectedItem.name, 1).then(function(results){
        console.log(results);
        vm.simResults = results;
      });
    }

  }]);

})();
