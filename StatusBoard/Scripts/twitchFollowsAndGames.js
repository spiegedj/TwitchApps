/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="groupedList.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TwitchFollowsAndGames = /** @class */ (function (_super) {
    __extends(TwitchFollowsAndGames, _super);
    function TwitchFollowsAndGames(container, measureCount, title) {
        var _this = _super.call(this, container, measureCount, title) || this;
        _this.retrieveItems();
        _this.setBackgroundColor("rgb(55,78,88)");
        return _this;
    }
    TwitchFollowsAndGames.prototype.retrieveItems = function () {
        $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function (json) {
            this.parseStreams(json);
        }.bind(this));
    };
    TwitchFollowsAndGames.prototype.parseStreams = function (json) {
        this._listItems = [];
        json.streams.forEach(function (stream) {
            var channel = stream.channel;
            var listItem = new GroupedListItem();
            listItem.title = channel.display_name;
            listItem.groupName = channel.game;
            listItem.line1 = "Playing " + channel.game;
            listItem.line2 = channel.status;
            listItem.details = stream.viewers.toLocaleString();
            listItem.imageURL = channel.logo;
            listItem.link = "http://www.twitch.tv/" + listItem.title;
            this._listItems.push(listItem);
        }, this);
        this.render();
    };
    return TwitchFollowsAndGames;
}(GroupedList));