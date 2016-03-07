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

        tweets = [];
        var div = document.createElement('div');
        div.innerHTML = data.body;
        var tweetElements = div.getElementsByClassName('timeline-TweetList-tweet');

        var displayed = (tweetElements.length > tf.maxTweets && tf.maxTweets) ? tf.maxTweets : tweetElements.length;

        var x = 0;
        while (x < displayed) {

            var isReeTweet = (tweetElements[x].getElementsByClassName('timeline-Tweet-retweetCredit').length > 0) ? true : false;

            if (isReeTweet && !tf.showReTweets) {
                if (displayed < tweetElements.length) {
                    displayed++;
                }
                x++;
                continue;
            }

            var tweetElement = (tweetElements[x].getElementsByClassName('timeline-Tweet')[0]);
            var tweetText = tweetElement.getElementsByClassName('timeline-Tweet-text')[0];
            var dateElement = tweetElement.getElementsByClassName('dt-updated')[0];
            var dateVO = new tweetDateVO(dateElement.innerText);
            var authorElement = tweetElement.getElementsByClassName('timeline-Tweet-author')[0];
            var authorVO = getAuthorVO(authorElement);
            /*remove for now*/
            /*var id = tweetElements[x].getAttribute('data-tweet-id');*/
            var tweetUrl = tweetElement.getElementsByClassName('timeline-Tweet-timestamp')[0].href;
            tweets.push(new tweetVO('', tweetUrl, tweetText.innerHTML, dateVO, authorVO));

            x++;
        }

        return tweets;
    }

    function getAuthorVO(element) {

        var profileName = (element.getElementsByClassName("TweetAuthor-name")[0]).innerText;
        var userName = (element.getElementsByClassName("TweetAuthor-screenName")[0]).innerText;
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