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
