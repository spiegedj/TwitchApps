/// <reference path="GroupedList.ts"/>
class Events extends GroupedList {
    constructor(container, measureCount) {
        super(container, measureCount, "");
        this.refreshRate = 5 * 60 * 1000;
        this.noHighlight = true;
        this.retrieveItems();
        this.setColor("#9D2A3B");
    }
    retrieveItems() {
        $.get("http://192.168.1.105:8080/sc2events", function (json) {
            this.parseEvent(json);
        }.bind(this));
    }
    parseEvent(json) {
        var events = [];
        json.events.forEach(function (event) {
            var listItem = new EventItem();
            var timeInMs = event.time || 0;
            var daysFrom = this.getDaysFrom(timeInMs);
            if (daysFrom < 0)
                return;
            var eventTime = this.getCountdownString(timeInMs);
            listItem.timeInMs = timeInMs;
            listItem.groupName = event.name;
            listItem.title = event.details;
            listItem.details = eventTime;
            listItem.line2 = this.getDateStrimg(timeInMs);
            listItem.groupIcon = event.image;
            if (daysFrom < 3) {
                listItem.status = Status.blue;
                if (daysFrom < .1) {
                    listItem.status = Status.green;
                }
            }
            events.push(listItem);
        }, this);
        events.sort(function (a, b) {
            return a.timeInMs - b.timeInMs;
        });
        this._listItems = events;
        this.render();
    }
    getDaysFrom(timeMs) {
        if (!timeMs)
            return 0;
        var date = new Date(timeMs);
        var now = new Date();
        return (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    }
    getDateStrimg(timeMs) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        var dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (!timeMs)
            return "";
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
    getCountdownString(timeMs) {
        if (!timeMs) {
            return "Live now";
        }
        var daysFrom = this.getDaysFrom(timeMs);
        var days = Math.floor(daysFrom);
        var hoursFrom = (daysFrom - days) * 24;
        var hours = Math.floor(hoursFrom);
        var minutesFrom = (hoursFrom - hours) * 60;
        var minutes = Math.floor(minutesFrom);
        return "Live in " + days + "d " + hours + "h " + minutes + "m";
    }
}
class EventItem extends GroupedListItem {
}
