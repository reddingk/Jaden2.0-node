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
