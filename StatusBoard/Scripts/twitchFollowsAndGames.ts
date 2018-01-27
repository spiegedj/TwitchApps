/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="groupedList.ts"/>

class TwitchFollowsAndGames extends GroupedList {

    private __inQueue: number;
    private __duplicates: {[key: string]: TwitchItem};

    public constructor(container: HTMLElement, measureCount: number, title: string) {
        super(container, measureCount, title);
        this.retrieveItems();
        this.setBackgroundColor("rgb(55,78,88)");
    }

    protected retrieveItems() {
        this.__inQueue = 3;
        this._listItems = [];
        this.__duplicates = {};

        $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function(json) {
            this.parseStreams(json, true);
        }.bind(this));

        $.get("https://api.twitch.tv/kraken/streams/?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&game=Overwatch", function(json) {
            this.parseStreams(json, false);
        }.bind(this));

        $.get("https://api.twitch.tv/kraken/streams/?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&game=Starcraft II", function(json) {
            this.parseStreams(json, false);
        }.bind(this));
    }

    private parseStreams(json: any, followed: boolean) {
        this.__inQueue--;

        json.streams.forEach(function(stream) {
            var channel = stream.channel;
            var listItem = new TwitchItem();

            let dup = this.__duplicates[channel.display_name];
            if (dup) { 
                if (followed) { 
                    dup.highlight = true;
                }
                return; 
            }
            
            listItem.title = channel.display_name;
            listItem.groupName = channel.game;
            listItem.line1 = "Playing " + channel.game;
            listItem.line2 =  channel.status;
            listItem.details = stream.viewers.toLocaleString();
            listItem.imageURL = channel.logo;
            listItem.link = "http://www.twitch.tv/" + listItem.title;
            listItem.highlight = followed;
            listItem.viewers = stream.viewers;
            
            this._listItems.push(listItem);
            this.__duplicates[channel.display_name] = listItem;
        }, this);

        if (this.__inQueue === 0) {
            this._listItems.sort((a: TwitchItem, b: TwitchItem) => {
                if (a.highlight && !b.highlight) { return -1; }

                if (!a.highlight && b.highlight) { return 1; }

                return b.viewers - a.viewers;
            });

            this.render();
        }
    }
}

class TwitchItem extends GroupedListItem {
    public viewers: number;
}