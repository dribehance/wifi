// by dribehance <dribehance.kksdapp.com>
angular.module("Server").directive('errSrc', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			// function body
			$(element).bind("error", function() {
				$(element).attr("src", attrs.errSrc);
			});
		}
	};
});