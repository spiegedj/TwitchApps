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

    $scope.getStreamSrc = function (title) {
        return "http://player.twitch.tv/?channel=" + title;
    };

    $scope.launchStream = function (stream) {
        ipcRenderer.send('launch-stream', stream.title);
    };

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
        imageURL: "Images/Twitch-logo.png"
    },
    {
        title: "StarCraft II",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Starcraft II",
        imageURL: "Images/Starcraft2Logo.png"
    },
    {
        title: "Overwatch",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Overwatch",
        imageURL: "Images/Overwatch-Logo.svg"
    },
    {
        title: "Super Mario Maker",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Super Mario Maker",
        imageURL: "Images/SuperMarioMaker.jpg"
    },
    {
        title: "Super Smash Bros. Wii U",
        url: baseURL + "?oauth_token=" + oauthToken + "&game=Super Smash Bros. for Wii U",
        imageURL: "Images/SmashBrosLogo.png"
    },
];