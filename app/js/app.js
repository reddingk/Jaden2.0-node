(function () {
	"use strict";

		angular.module('directives', []);
		angular.module('headerCtrl', ['ui.bootstrap']);
    angular.module('homeCtrl', ['ui.bootstrap']);

    angular.module('JadenApp', ['ngMaterial','ngAnimate', 'ui.router','directives', 'config','headerCtrl','homeCtrl']);

})();
