(function () {
	"use strict";

		angular.module('dataconfig', []);
		angular.module('directives', []);
		angular.module('headerCtrl', ['ui.bootstrap']);
    angular.module('homeCtrl', ['ui.bootstrap']);
		angular.module('jadaCtrl', ['ui.bootstrap']);

    angular.module('JadenApp', ['ngMaterial','ngAnimate', 'ui.router','directives', 'config', 'dataconfig', 'headerCtrl','homeCtrl', 'jadaCtrl']);

})();
