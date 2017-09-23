/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>

class TwitchGame extends ListManager {

    private __gameName: string;

    public constructor(container: HTMLElement, measureCount: number, gameName: string) {
        super(container, measureCount, gameName);
        this.__gameName = gameName;

        this.retrieveItems();
    }

    protected retrieveItems() : void {
        $.get("https://api.twitch.tv/kraken/streams/?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&game=" + this.__gameName, function(json) {
            this.parseGame(json);
        }.bind(this));
    }

    private parseGame(json: any): void {
        this.__listItems = [];
        json.streams.forEach(function(stream) {
            var channel = stream.channel;
            var listItem = new ListItem();

            listItem.title = channel.display_name;
            listItem.line1 = "Playing " + channel.game;
            listItem.line2 =  channel.status;
            listItem.details = stream.viewers.toLocaleString() ;
            listItem.imageURL = channel.logo;
            listItem.link = "http://www.twitch.tv/" + listItem.title;

            this.__listItems.push(listItem);
        }, this);

        this.render();
    }
}