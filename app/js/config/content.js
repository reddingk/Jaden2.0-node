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
