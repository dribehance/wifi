// by dribehance <dribehance.kksdapp.com>
angular.module("Server").factory("facebookServices", function($rootScope, $route, $http, $window, $location, $q, userServices, toastServices, errorServices, localStorageService, config) {
    $window.fbAsyncInit = function() {
        var FB = $window.FB || undefined;
        if (!FB) return;
        FB.init({
            appId: '217442991983314',
            xfbml: true,
            version: 'v2.6'
        });
    };
    return {
        // facebook share;
        share: function(link) {
            var FB = $window.FB || undefined;
            if (!FB) return;
            FB.ui({
                method: "feed",
                link: link || config.share.link,
                redirect_uri: link || config.share.link,
                caption: config.share.title
            }, function(response) {
                $route.reload();
            });
        },
        // facebook login
        login: function() {
            var deferred = $q.defer();
            var self = this;
            self._facebook_connected()
                .then(function(data) {
                    return data;
                })
                .then(function(data) {
                    self._query_facebook_user_info()
                        .then(function(data) {
                            deferred.resolve(data);
                        })
                })
            return deferred.promise;
        },
        logout: function() {
            var FB = $window.FB || undefined;
            if (!FB) return;
            FB.logout(function(response) {})
        },
        _facebook_connected: function() {
            var deferred = $q.defer();
            var FB = $window.FB || undefined;
            if (!FB) return;
            toastServices.show();
            FB.login(function(response) {
                toastServices.hide();
                if (response.status == "connected") {
                    deferred.resolve(response);
                } else {
                    deferred.reject('_facebook_connected occured');
                }
            }, {
                scope: 'public_profile,email'
            });
            return deferred.promise;
        },
        _query_facebook_user_info: function() {
            var deferred = $q.defer();
            var FB = $window.FB || undefined;
            if (!FB) return;
            FB.api("/me", {
                    fields: "id,email,name,picture,gender,last_name"
                },
                function(response) {
                    if (!response || response.error) {
                        deferred.reject('_query_facebook_user_info error occured');
                    } else {
                        deferred.resolve(response);
                    }
                });
            return deferred.promise;
        },
    }
});