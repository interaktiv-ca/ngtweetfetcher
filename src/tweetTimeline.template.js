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
