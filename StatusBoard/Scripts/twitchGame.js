/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>
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
var TwitchGame = /** @class */ (function (_super) {
    __extends(TwitchGame, _super);
    function TwitchGame(container, measureCount, gameName) {
        var _this = _super.call(this, container, measureCount, gameName) || this;
        _this.__gameName = gameName;
        _this.retrieveItems();
        return _this;
    }
    TwitchGame.prototype.retrieveItems = function () {
        $.get("https://api.twitch.tv/kraken/streams/?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&game=" + this.__gameName, function (json) {
            this.parseGame(json);
        }.bind(this));
    };
    TwitchGame.prototype.parseGame = function (json) {
        this._listItems = [];
        json.streams.forEach(function (stream) {
            var channel = stream.channel;
            var listItem = new ListItem();
            listItem.title = channel.display_name;
            listItem.line1 = "Playing " + channel.game;
            listItem.line2 = channel.status;
            listItem.details = stream.viewers.toLocaleString();
            listItem.imageURL = channel.logo;
            listItem.link = "http://www.twitch.tv/" + listItem.title;
            this._listItems.push(listItem);
        }, this);
        this.render();
    };
    return TwitchGame;
}(ListManager));
