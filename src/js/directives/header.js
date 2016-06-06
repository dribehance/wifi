// by dribehance <dribehance.kksdapp.com>
angular.module("Skillopedia").directive('dribehanceHeader', function() {
	return {
		restrict: 'E',
		templateUrl: "templates/header.html",
		scope: {
			title: "=",
			backAction: "="
		},
		link: function(scope, element, attrs) {
			// function body
		}
	};
});