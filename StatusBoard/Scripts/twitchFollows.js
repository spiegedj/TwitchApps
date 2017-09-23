/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TwitchFollows = (function (_super) {
    __extends(TwitchFollows, _super);
    function TwitchFollows(container, measureCount, title) {
        _super.call(this, container, measureCount, title);
        this.retrieveItems();
        this.setBackgroundColor("rgb(55,78,88)");
    }
    TwitchFollows.prototype.retrieveItems = function () {
        $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function (json) {
            this.parseStreams(json);
        }.bind(this));
    };
    TwitchFollows.prototype.parseStreams = function (json) {
        this.__listItems = [];
        json.streams.forEach(function (stream) {
            var channel = stream.channel;
            var listItem = new ListItem();
            listItem.title = channel.display_name;
            listItem.line1 = "Playing " + channel.game;
            listItem.line2 = channel.status;
            listItem.details = stream.viewers.toLocaleString();
            listItem.imageURL = channel.logo;
            listItem.link = "http://www.twitch.tv/" + listItem.title;
            this.__listItems.push(listItem);
        }, this);
        this.render();
    };
    return TwitchFollows;
}(ListManager));
