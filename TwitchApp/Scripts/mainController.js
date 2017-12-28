var app = angular.module("twitchApp", []);
var ipcRenderer = require('electron').ipcRenderer;

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http://player.twitch.tv/**'
  ]);
});

app.controller("mainController", ["$scope", function ($scope) {
    $scope.streaming = false;
    $scope.streams = [];
    $scope.selectedStream = {};
    $scope.tabs = tabs;
    $scope.selectedTab = tabs[0];
    $scope.lastUpdated;
    $scope.previewing = false;

    $scope.topGames = [];
    $scope.loadCount = 48;
    $scope.topGamesOffset = 0;
    $scope.showTopGames = false;

    $scope.maxTiles = 10;
    $scope.startTile = 0;

    loadStreams();
    function loadStreams(url) {
        url = url || $scope.selectedTab.url;
        $scope.lastUpdated = new Date();
        $.get(url, function(json) {
            parseStreams(json);
        });
    };

    function parseStreams(json) {
        $scope.streams = [];
        json.streams.forEach(function(stream) {
            var channel = stream.channel;
            var streamObj = {};

            streamObj.title = channel.display_name;
            streamObj.game = "Playing " + channel.game;
            streamObj.viewers = numberWithCommas(stream.viewers) + " viewers";
            streamObj.details = channel.status;
            streamObj.imageURL = channel.logo;
            streamObj.link = "http://www.twitch.tv/" + streamObj.title;
            streamObj.profileBanner = stream.channel.profile_banner;
            streamObj.template = stream.preview.template;
            streamObj.preview = getPreviewUrl(streamObj.template, 1920, 1080);
            streamObj.language = channel.language;
            var img = $("<img />").attr('src', streamObj.preview);

            $scope.streams.push(streamObj);
        }, this);
        
        $scope.selectStream($scope.streams[0]);
        $scope.$apply();
    };

    function getPreviewUrl(template, width, height) {
        template = template.replace("{width}", width);
        template = template.replace("{height}", height);
        template += "?r=" + new Date();
        return template;
    }

    $scope.selectStream = function (stream) {
        $scope.selectedStream = stream;
    };

    $scope.selectTab = function(tab) {
        $scope.selectedTab = tab;
        if (tab.title === "Top Games") {
            $scope.openTopPage();
        } else {
            $scope.startTile = 0;
            loadStreams();
        }
    };

    $scope.getStreamSrc = function(title) {
        return "http://player.twitch.tv/?channel=" + title;
    };

    $scope.pageUp = function() {
        $scope.startTile = Math.max($scope.startTile - $scope.maxTiles, 0);
    }

    $scope.pageDown = function() {
        if ($scope.startTile + $scope.maxTiles < $scope.streams.length) {
            $scope.startTile = $scope.startTile + $scope.maxTiles;
        }
    }

    $scope.launchStream = function(stream) {
        ipcRenderer.send('launch-stream', stream.title);
        $scope.streaming = true;
    };

    $scope.stopStream = function() {
        ipcRenderer.send('stop-stream');
        $scope.streaming = false;
        $scope.$apply();
    };

    $(document).keypress(function(event) {
        // Stop Stream
        if (event.keyCode === constants.key_5 || event.keyCode === constants.key_Q || event.keyCode === constants.key_q) 
        {
            $scope.streaming ? $scope.stopStream() : $scope.launchStream($scope.selectedStream);
        }
        // Tab Up / Down
        else if (event.keyCode === constants.key_7 || event.keyCode === constants.key_1) 
        {
            var index = $scope.tabs.indexOf($scope.selectedTab);
            event.keyCode === constants.key_1 ? index-- : index++;
            index = Math.max(0, index);
            index = Math.min($scope.tabs.length - 1, index);
            $scope.selectTab($scope.tabs[index]);
        }
        // Stream Up / Down
        else if (event.keyCode === constants.key_3 || event.keyCode === constants.key_9) {
            var index = $scope.streams.indexOf($scope.selectedStream);
            event.keyCode === constants.key_3 ? index-- : index++;
            index = Math.max(0, index);
            index = Math.min($scope.streams.length - 1, index);
            $scope.selectStream($scope.streams[index]);
        }
        // Page Up / Down
        else if (event.keyCode === constants.key_2 || event.keyCode === constants.key_8) {
            event.keyCode === constants.key_2 ? $scope.pageUp() : $scope.pageDown();
        } else if (event.keyCode === constants.key_0) {
            ipcRenderer.send("toggle-fullscreen");
        }

        $scope.$apply();
    });

    $(document).mouseover(function(event) {
        var now = new Date();
        var secondDiff = (now.getTime() - $scope.lastUpdated.getTime()) / 1000;

        if (secondDiff > (60) && !$scope.streaming) {
            loadStreams();
        }
    });

    $scope.openTopPage = function() {
        $scope.showTopGames = true;
        loadTopGames();
    };

    $scope.topPageDown = function() {
        $scope.topGamesOffset += $scope.loadCount;
        loadTopGames();
    }

    $scope.topPageUp = function() {
        $scope.topGamesOffset -= $scope.loadCount;
        $scope.topGamesOffset = Math.max(0, $scope.topGamesOffset);
        loadTopGames();
    }

    function loadTopGames() {
        $.get("https://api.twitch.tv/kraken/games/top?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&limit=" 
            + $scope.loadCount+ 
            "&offset=" + $scope.topGamesOffset, 
        function(json) {
            parseTopGames(json);
        });
    };

    $scope.topGameSelected = function(game) {
        $scope.showTopGames = false;
        $scope.selectedTab.imageURL = game.boxHigh;
        loadStreams(constructStreamUrl(game.name));
    };

    function parseTopGames(json) {
        $scope.topGames = [];
        json.top.forEach(function(topGame) {
            var gameObj = {};

            gameObj.name = topGame.game.name;
            gameObj.viewers = numberWithCommas(topGame.viewers) + " viewers";
            gameObj.box = topGame.game.box.medium;
            gameObj.boxHigh = topGame.game.box.large;

            $scope.topGames.push(gameObj);
        }, this);
        $scope.$apply();
    };

    ipcRenderer.on('search', function(event, data) {
        searchByStreamer(data.streamer);
    });

    function searchByStreamer(streamer) {
        $.get("https://api.twitch.tv/kraken/search/channels?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&limit=1&query=" + streamer,
        function(json) {
            var streamTitle = json.channels[0].name;
            $scope.launchStream({ title: streamTitle });
            $scope.$apply();
            $('body').focus();
        });
    }
}]);

var constants = {
    key_q: 113,
    key_Q: 81,
    key_0: 48,
    key_1: 49,
    key_2: 50,
    key_3: 51,
    key_4: 52,
    key_5: 53,
    key_6: 54,
    key_7: 55,
    key_8: 56,
    key_9: 57
};

var oauthToken = "a7vx7pwxfhiidyn7zmup202fuxgr3k";
var baseURL = "https://api.twitch.tv/kraken/streams/";
var constructStreamUrl = function(gameName) {
    return baseURL + "?oauth_token=" + oauthToken + "&game=" + gameName;
};

var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var tabs = [
    {
        title: "Follows",
        url: baseURL + "followed?oauth_token=" + oauthToken,
        imageURL: "Images/Follows-Game.jpg"
    },
    {
        title: "StarCraft II",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Starcraft II",
        imageURL: "Images/Starcraft2-Game.jpg"
    },
    {
        title: "Overwatch",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Overwatch",
        imageURL: "Images/Overwatch-Game.jpg"
    },
    {
        title: "Starcraft",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Starcraft",
        imageURL: "Images/StarCraft.jpg"
    },
    {
        title: "Top Games",
        imageURL: "Images/Top.jpg"
    },
];