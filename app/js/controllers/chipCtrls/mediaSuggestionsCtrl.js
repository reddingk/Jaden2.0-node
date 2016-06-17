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
