/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="groupedList.ts"/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Tournaments = /** @class */ (function (_super) {
    __extends(Tournaments, _super);
    function Tournaments(container, measureCount) {
        var _this = _super.call(this, container, measureCount, "") || this;
        _this.refreshRate = 5 * 60 * 1000;
        _this.imageHeight = 36;
        _this.titleFontSize = 15;
        _this.retrieveItems();
        _this.setColor("#9D2A3B");
        return _this;
    }
    Tournaments.prototype.retrieveItems = function () {
        this.wcsEvents();
    };
    Tournaments.prototype.wcsEvents = function () {
        $.get("https://wcs.starcraft2.com/en-us/schedule/", function (html) {
            this.parseWCSEvents(html);
        }.bind(this));
    };
    Tournaments.prototype.parseWCSEvents = function (html) {
        var _this = this;
        var doc = $($.parseHTML(html));
        var cards = doc.find(".eventCard-entry");
        var events = [];
        cards.each(function (index, card) {
            var tournament = $(card).find(".metaData-hd").first().children().first().text();
            var stage = $(card).find(".meta-Data-ft").first().children().first().text();
            var logo = $(card).find(".eventCard-logo").first().children().first().attr("src");
            var timestamp = $(card).find(".eventCard-time").first().children().first().attr("data-locale-time-timestamp");
            var item = new GroupedListItem();
            item.groupName = tournament;
            item.title = stage;
            item.imageURL = "";
            item.line1 = _this.getDateStrimg(Number(timestamp));
            item.line2 = " ";
            item.details = _this.getCountdownString(Number(timestamp));
            events.push(item);
        });
        this._listItems = events;
        this.render();
    };
    Tournaments.prototype.getSpacing = function (before, offset) {
        var spacesCount = offset - before.length;
        var sp = "&nbsp;";
        var spaces = "";
        for (var i = 0; i < spacesCount; i++) {
            spaces += sp;
        }
        return spaces;
    };
    Tournaments.prototype.liquidpediaTournaments = function () {
        $.get("https://liquipedia.net/starcraft2/Main_Page", function (html) {
            this.parseLiquipediaTournaments(html);
        }.bind(this));
    };
    Tournaments.prototype.parseLiquipediaTournaments = function (html) {
        var doc = $($.parseHTML(html));
        var upcoming = doc.find(".tournaments-list").first().find(".tournaments-list-type-list").first();
        var ongoing = doc.find(".tournaments-list").first().find(".tournaments-list-type-list").eq(1);
        var tournaments = [];
        var $this = this;
        upcoming.find("li").each(function () {
            var listItem = $this.createListItem($(this));
            listItem.groupName = "Upcoming";
            tournaments.push(listItem);
        });
        ongoing.find("li").each(function () {
            var listItem = $this.createListItem($(this));
            listItem.groupName = "Ongoing";
            tournaments.push(listItem);
        });
        this._listItems = tournaments;
        this.render();
    };
    Tournaments.prototype.createListItem = function (tournament) {
        var name = tournament.find(".tournaments-list-name").first().text();
        var date = tournament.find(".tournaments-list-dates").first().text();
        var image = tournament.find("img").first();
        var listItem = new GroupedListItem();
        listItem.title = this.ellipsis(name, 40);
        var sp = "&nbsp;";
        listItem.line2 = sp + sp + sp + sp + date;
        if (image && image.attr("src")) {
            var imageURL = "https://liquipedia.net" + image.attr("src");
            listItem.imageURL = imageURL;
        }
        return listItem;
    };
    Tournaments.prototype.ellipsis = function (text, size) {
        if (text.length > size) {
            text = text.slice(0, size);
            text += "...";
        }
        return text;
    };
    Tournaments.prototype.getDaysFrom = function (timeMs) {
        if (!timeMs)
            return 0;
        var date = new Date(timeMs);
        var now = new Date();
        return (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    };
    Tournaments.prototype.getDateStrimg = function (timeMs) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        var dayOfWeekNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
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
    Tournaments.prototype.getCountdownString = function (timeMs) {
        if (!timeMs) {
            return "Live now";
        }
        var daysFrom = this.getDaysFrom(timeMs);
        var days = Math.floor(daysFrom);
        var hoursFrom = (daysFrom - days) * 24;
        var hours = Math.floor(hoursFrom);
        var minutesFrom = (hoursFrom - hours) * 60;
        var minutes = Math.floor(minutesFrom);
        return days + "d " + hours + "h " + minutes + "m";
    };
    return Tournaments;
}(GroupedList));
