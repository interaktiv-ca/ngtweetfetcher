/**
 * Service for jsonp request
 */
angular.module('ng.tweetfetcher').factory('TweetService', ['$http', '$q', tweetServiceFunc]);

function tweetServiceFunc($http, $q) {

    var ts = this;
    var config = {
        params: {
            lang: "en",
            suppress_response_codes: true,
            rnd: Math.random(),
            callback: "JSON_CALLBACK"
        }
    };

    var baseUrl = "https://cdn.syndication.twimg.com/widgets/timelines/";  //+vm.twitterId+"?";

    function loadTweets(id) {


        var url = baseUrl + id + "?";

        return $http.jsonp(url, config)
            .then(function (response) {
                if (typeof response.data === 'object') {
                    return response.data;
                } else {
                    // invalid response
                    return $q.reject(response.data);
                }

            }, function (response) {
                // something went wrong
                return $q.reject(response.data);
            });

    };

    return {

        load: loadTweets

    };
};
