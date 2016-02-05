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