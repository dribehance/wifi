// by dribehance <dribehance.kksdapp.com>
angular.module("Server").directive('onload', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			// function body
			$(element).css({
				opacity: 0
			});
			$(element).bind("load", function() {
				$(element).css({
					opacity: 1
				});
			})
		}
	};
});