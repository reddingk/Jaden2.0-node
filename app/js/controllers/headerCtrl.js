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
