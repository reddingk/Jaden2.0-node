  (function(){
   "use strict";

    angular.module('headerCtrl').controller('HeaderController', ['$state', 'jadenInfo', function($state, jadenInfo){
      var vm = this;
      vm.checkActivePage = checkActivePage;

      vm.chips = jadenInfo.chips.all();
      function checkActivePage(current) {
			     var currentPage = $state;
           if (currentPage != null && currentPage.current.name.indexOf(current) > -1) { return true; }
			     else { return false; }
		  }

    }]);

})();
