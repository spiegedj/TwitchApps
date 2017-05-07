var app = angular.module("twitchApp", []);

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http://player.twitch.tv/**'
  ]);
});

app.controller("mainController", ["$scope", function ($scope) {

    $scope.streams = [];
    $scope.selectedStream = {};

    loadStreams();
    function loadStreams() {
        // $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function(json) {
        $.get("https://api.twitch.tv/kraken/streams/?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&game=Starcraft II", function(json) {
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

    $scope.getStreamSrc = function (title) {
        return "http://player.twitch.tv/?channel=" + title;
    };
}]);


// $(document).ready(function() {
//     $(document).keypress(function(event) {
//         if (event.keyCode === 113 || event.keyCode === 81 || event.keyCode === 53) {
//             ipcRenderer.send('stop-stream');
//         }
//     });
// });