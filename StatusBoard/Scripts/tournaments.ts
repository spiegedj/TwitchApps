/// <reference path="groupedList.ts"/>

class Tournaments extends GroupedList {

    public refreshRate: number = 5 * 60 * 1000;

    public constructor(container: HTMLElement, measureCount: number) {
        super(container, measureCount, "");
        this.imageHeight = 36;
        this.titleFontSize = 15;
        this.retrieveItems();
        this.setColor("#9D2A3B");
    }

    protected retrieveItems() : void {  
        this.wcsEvents();
    }

    private wcsEvents(): void {
        $.get("https://wcs.starcraft2.com/en-us/schedule/", function(html) {
            this.parseWCSEvents(html);
        }.bind(this));
    }

    private parseWCSEvents(html: string): void {
        var doc = $($.parseHTML(html));
        var cards = doc.find(".eventCard-entry");

        var events : GroupedListItem[] = [];

        cards.each((index: number, card: Node[]) => {
            var tournament = $(card).find(".metaData-hd").first().children().first().text();
            var stage = $(card).find(".meta-Data-ft").first().children().first().text();
            var logo = $(card).find(".eventCard-logo").first().children().first().attr("src");
            var timestamp = $(card).find(".eventCard-time").first().children().first().attr("data-locale-time-timestamp");

            var item = new GroupedListItem();
            item.groupName = tournament;
            item.title = stage;
            item.imageURL = "";
            item.line1 =  this.getDateStrimg(Number(timestamp));
            item.line2 = " ";
            item.details = this.getCountdownString(Number(timestamp));
            events.push(item);
        });

        this._listItems = events;
        this.render();
    }

    private getSpacing(before: string, offset: number): string {
        var spacesCount = offset - before.length;
        const sp = "&nbsp;";

        let spaces = "";
        for (var i = 0; i < spacesCount; i++) {
            spaces += sp;
        }
        return spaces;
    }

    private liquidpediaTournaments(): void {
        $.get("https://liquipedia.net/starcraft2/Main_Page", function(html) {
            this.parseLiquipediaTournaments(html);
        }.bind(this));
    }

    private parseLiquipediaTournaments(html: string): void {
        var doc = $($.parseHTML(html));
        var upcoming = doc.find(".tournaments-list").first().find(".tournaments-list-type-list").first();
        var ongoing = doc.find(".tournaments-list").first().find(".tournaments-list-type-list").eq(1);

        var tournaments : GroupedListItem[] = [];
        var $this = this;

        upcoming.find("li").each(function() {
            var listItem = $this.createListItem($(this));
            listItem.groupName = "Upcoming";
            tournaments.push(listItem);
        });

        ongoing.find("li").each(function() {
            var listItem = $this.createListItem($(this));
            listItem.groupName = "Ongoing";
            tournaments.push(listItem);
        });

        this._listItems = tournaments;
        this.render();
    }

    private createListItem(tournament: JQuery<Node[]>): GroupedListItem {
        var name = tournament.find(".tournaments-list-name").first().text();
        var date = tournament.find(".tournaments-list-dates").first().text();
        var image = tournament.find("img").first();

        var listItem = new GroupedListItem();
        listItem.title = this.ellipsis(name, 40);
        const sp = "&nbsp;";
        listItem.line2 = sp + sp + sp + sp + date;
        if (image && image.attr("src")) {
            var imageURL = "https://liquipedia.net" + image.attr("src");
            listItem.imageURL = imageURL;
        }

        return listItem;
    }

    private ellipsis(text: string, size: number): string {
        if (text.length> size) {
            text = text.slice(0, size);
            text += "...";
        }
        return text;
    }

    private getDaysFrom(timeMs: number) : number {
        if (!timeMs) return 0;
        var date = new Date(timeMs);
        var now = new Date();
        return (date.getTime() - now.getTime()) / (1000 * 60  * 60 * 24);
    }

    private getDateStrimg(timeMs: number): string {
        var monthNames = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];
        var dayOfWeekNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

        if (!timeMs) return "";

        var date = new Date(timeMs);
        var locale = "en-us";
        var month = monthNames[date.getMonth()];
        var day = date.getDate();
        var dayOfWeek = dayOfWeekNames[date.getDay()];
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var minutesString = (minutes < 10) ? "0" + minutes : minutes;
        var amPm = (hour > 12) ? "PM" : "AM";
        hour = hour % 12;
        hour = hour == 0 ? hour + 12 : hour;

        return month + " " + day + " - " + dayOfWeek + " " + hour + ":" + minutesString + " " + amPm;
    }

    private getCountdownString(timeMs: number): string {
        if (!timeMs) { return "Live now"; }

        var daysFrom = this.getDaysFrom(timeMs);
        var days = Math.floor(daysFrom);
        var hoursFrom = (daysFrom - days) * 24;
        var hours = Math.floor(hoursFrom);
        var minutesFrom = (hoursFrom - hours) * 60;
        var minutes = Math.floor(minutesFrom);

        return days + "d " + hours + "h " + minutes + "m";
    }
}