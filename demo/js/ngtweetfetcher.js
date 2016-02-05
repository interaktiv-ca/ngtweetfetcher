/**
 * ngTweetFetcher - AngularJS directive based on Twitter Post Fetcher by Jason Mayes
 /*********************************************************************
 *  #### Twitter Post Fetcher v14.0 ####
 *  Coded by Jason Mayes 2015. A present to all the developers out there.
 *  www.jasonmayes.com
 *  Please keep this disclaimer with my code if you use it. Thanks. :-)
 *  Got feedback or questions, ask here:
 *  http://www.jasonmayes.com/projects/twitterApi/
 *  Github: https://github.com/jasonmayes/Twitter-Post-Fetcher
 *  Updates will be posted to this site.
 *********************************************************************/

angular.module('ng.tweetfetcher', []);

/**
 * Factory for parsing of tweets
 */

angular.module('ng.tweetfetcher').factory('TweetFactory', ['$document', '$http', '$log', '$q', '$window', tweetFactoryFunc]);

function tweetFactoryFunc($document, $http, $log, $q, $window) {
    var tf = this;
    var tweets = [];
    var config = {};
    var maxTweets = 0;
    var showReTweets = true;

    function setMaxTweets(maxTweets) {

        tf.maxTweets = maxTweets;
    }

    function setShowReTweets(showReTweets) {

        tf.showReTweets = showReTweets;
    }


    function authorVo(profileName, userName, profileURL, imageURL) {
        this.profileName = profileName;
        this.userName = userName;
        this.profileURL = profileURL;
        this.imageURL = imageURL;

    };
    function tweetVO(id, url, tweetHtml, tweetDateV0, authorVO) {
        this.id = id;
        this.url = url;
        this.tweetHtml = tweetHtml;
        this.dateVO = tweetDateV0;
        this.authorVO = authorVO;
    };

    function tweetDateVO(dateHtml) {


        this.dateHtml = dateHtml;
        // TODO support for this will be added ASAP
        // this.dateString = dateString;

    };

    function hashTagVO(tag, url) {
        this.tag = tag;
        this.url = url;


    }


    function parseToJson(data) {

        var div = document.createElement('div');
        div.innerHTML = data.body;
        var tweetElements = div.getElementsByClassName('tweet');
        var displayed = (tweetElements.length > tf.maxTweets && tf.maxTweets) ? tf.maxTweets : tweetElements.length;

        var x = 0;
        while (x < displayed) {


            var isReeTweet = (tweetElements[x].getElementsByClassName('retweet-credit').length > 0) ? true : false;

            if (isReeTweet && !tf.showReTweets) {
                if (displayed < tweetElements.length) {
                    displayed++;
                }
                x++;
                continue;
            }

            var tweetElement = (tweetElements[x].getElementsByClassName('e-entry-title')[0]);
            var dateElement = (tweetElements[x].getElementsByClassName('dt-updated')[0]);

            stripTagsFromInnerText(dateElement,'abbr');
            var authorElement = (tweetElements[x].getElementsByClassName('p-author')[0]);
            var id = tweetElements[x].getAttribute('data-tweet-id');
            var tweetUrl = tweetElements[x].getElementsByClassName('permalink')[0].href;
            var dateVO = new tweetDateVO(dateElement.innerText);
            var authorVO = getAuthorVO(authorElement);

            tweets.push(new tweetVO(id, tweetUrl, tweetElement.innerHTML, dateVO, authorVO));

            x++;
        }

        return tweets;
    }

    function getAuthorVO(element) {

        var profileName = (element.getElementsByClassName("p-name")[0]).innerText;
        var userName = (element.getElementsByClassName("p-nickname")[0]).innerText;
        var imageURL = (element.getElementsByTagName("img")[0]).getAttribute('data-src-2x');
        var profileURL = (element.getElementsByTagName("a")[0]).href;

        return new authorVo(profileName, userName, profileURL, imageURL);

    }

    function getHashTags(element) {

        var tags = element.getElementsByTagName("a");
        var x = 0;
        while (x < tags.length) {

            x++;
        }
        var hashtag = [];

    }

    function stripTagsFromInnerText(element, tag) {


        var innerText = element.innerText;
        var tags = element.getElementsByTagName(tag);
        var x = 0;

        while (x < tags.length) {
            innerText = innerText.replace((tags[x]).innerText, '');
            x++;
        }

        return innerText;
    }


    function parseTweets(data) {

        tweets = parseToJson(data);
        return tweets;
    }

    return {
        tweets: [],
        setMaxTweets: setMaxTweets,
        setShowReTweets: setShowReTweets,
        parse: parseTweets

    };

}
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

/**
 * Directive for tweettimeline or ticker
 */
angular.module('ng.tweetfetcher').directive('tweetTimeline',['TweetFactory' ,'TweetService' ,tweetTimelineFunc]);

function tweetTimelineFunc() {

    return {
        restrict: 'AECM',
        bindToController: true,
        controllerAs: 'vm',
        templateUrl: 'templates/tweetTimeline.template.html',
        replace: true,
        scope: {

            twitterId: '@',
            maxTweets: '@',
            showReTweets: '=?',
            isTicker: '=?',
            interval:'@'

        },
        controller: 'TweetTimelineCtrl'
    }

}
/**
 *  Sub directive for individual tweets
 */
angular.module('ng.tweetfetcher').directive('timelineTweet', ['$compile', timelineTweetFunc]);

function timelineTweetFunc($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            tweet: '='
        },
        templateUrl: 'templates/timelineTweet.template.html',

        compile: function (elem, attrs) {

            return {

                post: function (scope, element, attrs) {

                    var tweetParagraph = element[0].getElementsByTagName('p')[0];
                    tweetParagraph.innerHTML = scope.tweet.tweetHtml;

                }
            }
        }

    }
}
/**
 * Controller for tweetTime directive
 */

angular.module('ng.tweetfetcher').controller('TweetTimelineCtrl', ['$scope', '$http','TweetFactory', 'TweetService', tweetTimelineControllerFunc]);


function tweetTimelineControllerFunc($scope, $http, TweetFactory, TweetService) {

    var vm = this;

    vm.showReTweets = angular.isDefined(vm.showReTweets) ? vm.showReTweets : true;
    vm.maxTweets = angular.isDefined(vm.maxTweets) ? vm.maxTweets : 0;
    vm.isTicker = angular.isDefined(vm.isTicker) ? vm.isTicker : false;
    vm.interval = angular.isDefined(vm.interval) ? vm.interval : 2000;

    TweetFactory.setMaxTweets(vm.maxTweets);
    TweetFactory.setShowReTweets(vm.showReTweets);


    TweetService.load(vm.twitterId).then(function (response) {

        vm.tweets = TweetFactory.parse(response);
        if(vm.isTicker) setInterval(vm.refresh,vm.interval) ;

    });

    vm.activeTweet=0;

    vm.setTickerActive = function(index) {

        if(!vm.isTicker) return true;

        if (index == vm.activeTweet) {
            return 1 ;
        } else {
            return 0 ;
        }
    }



    vm.refresh = function() {


        $scope.$apply(function() {
                vm.activeTweet++ ;

                if (vm.activeTweet >= vm.tweets.length) {
                    vm.activeTweet = 0 ;
                }
            }
        )

    }



}




angular.module('ng.tweetfetcher').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/timelineTweet.template.html',
    '<li class="tweet-item">\n' +
    '\n' +
    '    <div class="tweet-content">\n' +
    '        <div class="tweet-header">\n' +
    '            <div class="tweet-avatar">\n' +
    '                <a ng-href="{{tweet.authorVO.profileURL}}"\n' +
    '                   data-scribe="element:user_link" target="_blank">\n' +
    '                    <img class="tweet-img" alt="" data-scribe="element:avatar" ng-src="{{tweet.authorVO.imageURL}}">\n' +
    '                </a>\n' +
    '            </div>\n' +
    '            <span>\n' +
    '                <span><a ng-href="{{tweet.authorVO.profileURL}}" data-scribe="element:name">{{tweet.authorVO.profileName}}</a></span>\n' +
    '                <span><a ng-href="{{tweet.authorVO.profileURL}}" data-scribe="element:screen_name">{{tweet.authorVO.userName}}</a></span>\n' +
    '            </span>\n' +
    '            <span class="tweetTimePosted"><a ng-href="{{tweet.url}}">{{ tweet.dateVO.dateHtml }}</a></span>\n' +
    '        </div>\n' +
    '\n' +
    '\n' +
    '        <p class="tweet-text"></p>\n' +
    '        <a class="tweet-expand" ng-href="{{ tweet.url }}"><b>Expand</b></a>\n' +
    '    </div>\n' +
    '    </div>\n' +
    ' <!--   TODO add show controls option -->\n' +
    '<!--    <div class="tweet-interact">\n' +
    '\n' +
    '        <a ng-href="https://twitter.com/intent/tweet?in_reply_to={{ tweet.id }}" class="twitter_reply_icon" target="_blank">Reply</a>\n' +
    '        <a ng-href="https://twitter.com/intent/retweet?tweet_id={{ tweet.id }}" class="twitter_retweet_icon" target="_blank">Retweet</a>\n' +
    '        <a ng-href="https://twitter.com/intent/favorite?tweet_id={{ tweet.id }}" class="twitter_fav_icon" target="_blank">Favorite</a>\n' +
    '\n' +
    '    </div>-->\n' +
    '\n' +
    '</li>');
}]);

angular.module('ng.tweetfetcher').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/tweetTimeline.template.html',
    '<ol class="tweet-list" >\n' +
    '\n' +
    '    <timeline-tweet ng-show="vm.setTickerActive($index)" ng-repeat=\'tweet in vm.tweets track by $index\'  tweet=\'tweet\'>\n' +
    '    </timeline-tweet>\n' +
    '</ol>\n' +
    '\n' +
    '');
}]);
