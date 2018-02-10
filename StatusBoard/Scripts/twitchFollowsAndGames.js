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
        _this.setColor("#323E1C");
        return _this;
    }
    TwitchFollowsAndGames.prototype.retrieveItems = function () {
        var _this = this;
        this.__inQueue = 1;
        this._listItems = [];
        this.__duplicates = {};
        this.__gameList = [
            "Overwatch",
            "Starcraft II",
            "Super Smash Bros. for Wii U",
            "Super Smash Bros. Melee",
            "Starcraft",
            "Super Mario Maker",
            "Super Mario Odyssey"
        ];
        $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function (json) {
            this.parseStreams(json, true);
        }.bind(this));
        this.__gameList.forEach(function (game) {
            _this.__inQueue++;
            $.get("https://api.twitch.tv/kraken/streams/?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&game=" + game, function (json) {
                this.parseStreams(json, false);
            }.bind(_this));
        });
    };
    TwitchFollowsAndGames.prototype.parseStreams = function (json, followed) {
        this.__inQueue--;
        json.streams.forEach(function (stream) {
            var channel = stream.channel;
            var listItem = new TwitchItem();
            var dup = this.__duplicates[channel.display_name];
            if (dup) {
                if (followed) {
                    dup.highlight = true;
                }
                return;
            }
            listItem.title = channel.display_name;
            listItem.groupName = channel.game;
            listItem.line1 = "Playing " + channel.game;
            listItem.line2 = channel.status;
            listItem.details = this.__addCommas(stream.viewers);
            listItem.imageURL = channel.logo;
            listItem.link = "http://www.twitch.tv/" + listItem.title;
            listItem.highlight = followed;
            listItem.viewers = stream.viewers;
            this._listItems.push(listItem);
            this.__duplicates[channel.display_name] = listItem;
        }, this);
        if (this.__inQueue === 0) {
            this._listItems.sort(function (a, b) {
                if (a.highlight && !b.highlight) {
                    return -1;
                }
                if (!a.highlight && b.highlight) {
                    return 1;
                }
                return b.viewers - a.viewers;
            });
            this.render();
        }
    };
    TwitchFollowsAndGames.prototype.__addCommas = function (num) {
        var numString = num.toString();
        var commaString = "";
        for (var i = numString.length; i > 3; i -= 3) {
            commaString = "," + numString.substr(Math.max(0, i - 3), i) + commaString;
        }
        commaString = numString.substr(0, i) + commaString;
        return commaString;
    };
    return TwitchFollowsAndGames;
}(GroupedList));
var TwitchItem = /** @class */ (function (_super) {
    __extends(TwitchItem, _super);
    function TwitchItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TwitchItem;
}(GroupedListItem));
