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
