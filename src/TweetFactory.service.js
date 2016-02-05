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