/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>

class Events extends ListManager {

    public constructor(container: HTMLElement, measureCount: number) {
        super(container, measureCount, "Events");
        this.retrieveItems();
        this.setBackgroundColor("rgb(86,24,59)");
    }

    protected retrieveItems() : void {
        $.get("http://192.168.1.105:8080/sc2events", function(json) {
            this.parseEvent(json);
        }.bind(this));
    }

    private parseEvent(json: any): void {
        var events : EventItem[] = [];
        json.events.forEach(function(event) {
            var listItem = new EventItem();
            var timeInMs = event.time || 0;
            var daysFrom = this.getDaysFrom(timeInMs);
            if (daysFrom < 0) return;
            var eventTime = this.getCountdownString(timeInMs);
            listItem.timeInMs = timeInMs;

            listItem.title = event.name + ": " + event.details;
            listItem.line1 = eventTime;
            listItem.line2 = this.getDateStrimg(timeInMs);
            listItem.details = "";
            listItem.imageURL = event.image;

            if (daysFrom < 3) {
                listItem.status = Status.blue;
                if (daysFrom < .1) {
                    listItem.status = Status.green;
                }
            }

            events.push(listItem);
        }, this);

        events.sort(function (a: EventItem, b: EventItem): number {
            return a.timeInMs - b.timeInMs;
        });

        this.__listItems = events;
        this.render();
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
        var dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

        return "Live in " + days + "d " + hours + "h " + minutes + "m";
    }
}

class EventItem extends ListItem {
    timeInMs: number;
}