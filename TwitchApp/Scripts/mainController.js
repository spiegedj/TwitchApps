var app = angular.module("twitchApp", []);
var ipcRenderer = require('electron').ipcRenderer;

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http://player.twitch.tv/**'
  ]);
});

app.controller("mainController", ["$scope", function ($scope) {

    $scope.streams = [];
    $scope.selectedStream = {};
    $scope.tabs = tabs;
    $scope.selectedTab = tabs[0];

    $scope.maxTiles = 8;
    $scope.startTile = 0;

    loadStreams();
    function loadStreams() {
        $.get($scope.selectedTab.url, function(json) {
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
            streamObj.viewers = stream.viewers + " viewers";
            streamObj.details = channel.status;
            streamObj.imageURL = channel.logo;
            streamObj.link = "http://www.twitch.tv/" + streamObj.title;
            streamObj.profileBanner = stream.channel.profile_banner;
            var preview = stream.preview.template;
            if (preview) {
                preview = preview.replace("{width}", 640);
                preview = preview.replace("{height}", 360);
            }
            streamObj.preview = preview;

            $scope.streams.push(streamObj);
        }, this);
        
        $scope.selectedStream = $scope.streams[0];
        $scope.$apply();
    };

    $scope.selectStream = function (stream) {
        $scope.selectedStream = stream;
    };

    $scope.selectTab = function(tab) {
        $scope.selectedTab = tab;
        loadStreams();
    }

    $scope.getStreamSrc = function(title) {
        return "http://player.twitch.tv/?channel=" + title;
    };

    $scope.launchStream = function(stream) {
        ipcRenderer.send('launch-stream', stream.title);
    };

    $scope.pageUp = function() {
        $scope.startTile = Math.max($scope.startTile - $scope.maxTiles, 0);
    }

    $scope.pageDown = function() {
        if ($scope.startTile + $scope.maxTiles < $scope.streams.length) {
            $scope.startTile = $scope.startTile + $scope.maxTiles;
        }
    }

    $(document).keypress(function(event) {
        if (event.keyCode === 113 || event.keyCode === 81 || event.keyCode === 53) {
            ipcRenderer.send('stop-stream');
        }
    });
}]);

var oauthToken = "a7vx7pwxfhiidyn7zmup202fuxgr3k";
var baseURL = "https://api.twitch.tv/kraken/streams/";
var tabs = [
    {
        title: "Follows",
        url: baseURL + "followed?oauth_token=" + oauthToken,
        imageURL: "Images/Follows-Game.jpg"
    },
    {
        title: "StarCraft II",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Starcraft II",
        imageURL: "Images/StarCraft2-Game.jpg"
    },
    {
        title: "Overwatch",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Overwatch",
        imageURL: "Images/Overwatch-Game.jpg"
    },
    {
        title: "Super Mario Maker",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Super Mario Maker",
        imageURL: "Images/SuperMarioMaker-Game.jpg"
    },
    {
        title: "Super Smash Bros. Wii U",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Super Smash Bros. for Wii U",
        imageURL: "Images/SuperSmashBros-Game.jpg"
    },
];