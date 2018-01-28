/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="groupedList.ts"/>

class TwitchFollowsAndGames extends GroupedList {

    private __inQueue: number;
    private __duplicates: {[key: string]: TwitchItem};
    private __gameList: string[];

    public constructor(container: HTMLElement, measureCount: number, title: string) {
        super(container, measureCount, title);
        this.retrieveItems();
        this.setBackgroundColor("rgb(55,78,88)");
    }

    protected retrieveItems() {
        this.__inQueue = 1;
        this._listItems = [];
        this.__duplicates = {};

        this.__gameList = [
            "Overwatch",
            "Starcraft II",
            "Super Smash Bros. for Wii U",
            "Super Smash Bros. Melee",
            "Starcraft",
        ];

        $.get("https://api.twitch.tv/kraken/streams/followed?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k", function(json) {
            this.parseStreams(json, true);
        }.bind(this));

        this.__gameList.forEach((game: string) => {
            this.__inQueue++;
            $.get("https://api.twitch.tv/kraken/streams/?oauth_token=a7vx7pwxfhiidyn7zmup202fuxgr3k&game=" + game, function(json) {
                this.parseStreams(json, false);
            }.bind(this));
        });
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
            listItem.details = this.__addCommas(stream.viewers);
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

    private __addCommas(num: number) {
        var numString = num.toString();
        var commaString = "";

        for (var i = numString.length; i > 3 ; i -= 3) {
            commaString = "," + numString.substr(Math.max(0, i-3), i) + commaString;
        }
        commaString = numString.substr(0, i) + commaString;
        return commaString;
    }
}

class TwitchItem extends GroupedListItem {
    public viewers: number;
}