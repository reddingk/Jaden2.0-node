(function(){
   "use strict";

    angular.module('homeCtrl').controller('HomeController', ['$state', 'jadenInfo', function($state, jadenInfo){
      var vm = this;
      vm.title = "Home";

      vm.chips = jadenInfo.chips.all();
    }]);

})();
