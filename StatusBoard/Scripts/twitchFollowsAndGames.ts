/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="groupedList.ts"/>

class TwitchFollowsAndGames extends GroupedList {

    public constructor(container: HTMLElement, measureCount: number, title: string) {
        super(container, measureCount, title);
        this.retrieveItems();
        this.setBackgroundColor("rgb(55,78,88)");
    }

    protected retrieveItems() {
        $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function(json) {
            this.parseStreams(json);
        }.bind(this));
    }

    private parseStreams(json: any) {
        this._listItems = [];
        json.streams.forEach(function(stream) {
            var channel = stream.channel;
            var listItem = new GroupedListItem();

            listItem.title = channel.display_name;
            listItem.groupName = channel.game;
            listItem.line1 = "Playing " + channel.game;
            listItem.line2 =  channel.status;
            listItem.details = stream.viewers.toLocaleString();
            listItem.imageURL = channel.logo;
            listItem.link = "http://www.twitch.tv/" + listItem.title;

            this._listItems.push(listItem);
        }, this);

        this.render();
    }
}