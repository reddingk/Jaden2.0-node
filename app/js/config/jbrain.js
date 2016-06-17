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
