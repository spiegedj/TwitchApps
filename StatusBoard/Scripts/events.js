/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="listmanager.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Events = (function (_super) {
    __extends(Events, _super);
    function Events(container, measureCount) {
        _super.call(this, container, measureCount, "Events");
        this.retrieveItems();
        this.setBackgroundColor("rgb(86,24,59)");
    }
    Events.prototype.retrieveItems = function () {
        $.get("http://192.168.1.105:8080/sc2events", function (json) {
            this.parseEvent(json);
        }.bind(this));
    };
    Events.prototype.parseEvent = function (json) {
        var events = [];
        json.events.forEach(function (event) {
            var listItem = new EventItem();
            var timeInMs = event.time || 0;
            var daysFrom = this.getDaysFrom(timeInMs);
            if (daysFrom < 0)
                return;
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
        events.sort(function (a, b) {
            return a.timeInMs - b.timeInMs;
        });
        this.__listItems = events;
        this.render();
    };
    Events.prototype.getDaysFrom = function (timeMs) {
        if (!timeMs)
            return 0;
        var date = new Date(timeMs);
        var now = new Date();
        return (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    };
    Events.prototype.getDateStrimg = function (timeMs) {
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
    };
    Events.prototype.getCountdownString = function (timeMs) {
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
    };
    return Events;
}(ListManager));
var EventItem = (function (_super) {
    __extends(EventItem, _super);
    function EventItem() {
        _super.apply(this, arguments);
    }
    return EventItem;
}(ListItem));
