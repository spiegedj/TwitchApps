/// <reference path="listmanager.ts"/>
class TwitchFollows extends ListManager {
    constructor(container, measureCount, title) {
        super(container, measureCount, title);
        this.retrieveItems();
        this.setColor("rgb(55,78,88)");
    }
    retrieveItems() {
        $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function (json) {
            this.parseStreams(json);
        }.bind(this));
    }
    parseStreams(json) {
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
