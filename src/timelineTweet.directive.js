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