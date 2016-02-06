angular.module('ng.tweetfetcher').run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/timelineTweet.template.html',
    '<li class="tweet-item">\n' +
    '\n' +
    '    <div class="tweet-content">\n' +
    '        <div class="tweet-header">\n' +
    '            <div class="tweet-avatar">\n' +
    '                <a ng-href="{{tweet.authorVO.profileURL}}"\n' +
    '                   data-scribe="element:user_link" target="_blank">\n' +
    '                    <img class="tweet-img" alt="" ng-src="{{tweet.authorVO.imageURL}}">\n' +
    '                </a>\n' +
    '            </div>\n' +
    '            <span>\n' +
    '                <span><a ng-href="{{tweet.authorVO.profileURL}}">{{tweet.authorVO.profileName}}</a></span>\n' +
    '                <span><a ng-href="{{tweet.authorVO.profileURL}}">{{tweet.authorVO.userName}}</a></span>\n' +
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
