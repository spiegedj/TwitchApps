/// <reference path="listmanager.ts"/>
class TwitchGame extends ListManager {
    constructor(container, measureCount, gameName) {
        super(container, measureCount, gameName);
        this.__gameName = gameName;
        this.retrieveItems();
    }
    retrieveItems() {
        $.get("https://api.twitch.tv/kraken/streams/?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&game=" + this.__gameName, function (json) {
            this.parseGame(json);
        }.bind(this));
    }
    parseGame(json) {
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
    }
}
