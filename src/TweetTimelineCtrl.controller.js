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



