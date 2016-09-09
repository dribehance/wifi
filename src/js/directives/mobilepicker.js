// by dribehance <dribehance.kksdapp.com>
angular.module("Wifi").directive('mobilepicker', function($timeout) {
	return {
		restrict: 'E',
		scope: {
			options: "=",
		},
		template: "<input type='text' name='picker' readonly ng-model='options.value'>",
		link: function(scope, element, attrs) {
			var options = {
				// 开始年份(默认2010开始)
				beginyear: 1950,
				// 结束年份（默认到2020）
				endyear: new Date().getFullYear(),
				// 数组，默认['周日','周一','周二','周三','周四','周五','周六']
				days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				// 开始的小时
				// beginhour: "",
				// 结束的小时
				// endhour: "",
				// 开始的分钟
				// beginminute: "",
				// 结束的分钟
				// endminute: "",
				// 布尔值,若为true,插件初始化时始终指向当前时间，若为false，初始化时指向input的value值,默认为false
				curdate: false,
				// theme 主题
				// date:可选择年，月，日
				// datetime:可选择年，月，日，小时，分钟
				// time:可选择小时，分钟
				// month:可选择年，月
				theme: "date",
				// 调出插件的事件,默认为click
				event: "click",
				// iscroll4滚动设置,详情参见iscroll4
				// scrollOpt: {},
				// 回调函数，按确认后执行的函数，默认function(){}
				callBack: function(date) {
					scope.options.value = date.y + "-" + date.M + "-" + date.d
				}
			};
			// function body
			$timeout(function() {
				$(element).find("input").datePicker(angular.extend({}, options, scope.options));
			}, 0)
		}
	};
});