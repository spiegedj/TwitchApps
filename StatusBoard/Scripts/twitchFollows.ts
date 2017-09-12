/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>

class TwitchFollows extends ListManager {

    public constructor(container: HTMLElement, measureCount: number, title: string) {
        super(container, measureCount, title);
        this.retrieveItems();
    }

    protected retrieveItems() {
        $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function(json) {
            this.parseStreams(json);
        }.bind(this));
    }

    private parseStreams(json: any) {
        this.__listItems = [];
        json.streams.forEach(function(stream) {
            var channel = stream.channel;
            var listItem = new ListItem();

            listItem.title = channel.display_name;
            listItem.line1 = "Playing " + channel.game;
            listItem.line2 = stream.viewers.toLocaleString() + " viewers";
            listItem.details = channel.status;
            listItem.imageURL = channel.logo;
            listItem.link = "http://www.twitch.tv/" + listItem.title;

            this.__listItems.push(listItem);
        }, this);

        this.render();
    }
}