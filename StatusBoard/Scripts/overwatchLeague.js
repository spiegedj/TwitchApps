/// <reference path="../@types/jquery/jquery.d.ts"/>
/// <reference path="vsList.ts"/>
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
var OverwatchLeague = /** @class */ (function (_super) {
    __extends(OverwatchLeague, _super);
    function OverwatchLeague(container, measureCount, title) {
        var _this = _super.call(this, container, measureCount, title) || this;
        _this.retrieveItems();
        _this.setBackgroundColor("#333333");
        return _this;
    }
    OverwatchLeague.prototype.retrieveItems = function () {
        $.get("https://api.overwatchleague.com/schedule?locale=en_US", function (json) {
            this.parseMatches(json);
        }.bind(this));
    };
    OverwatchLeague.prototype.parseMatches = function (json) {
        var _this = this;
        this._listItems = [];
        var stages = json.data.stages;
        stages.forEach(function (stage) {
            var matches = stage.matches;
            matches.forEach(function (match) {
                var matchState = match.state;
                if (matchState.toUpperCase() !== "CONCLUDED" && match.competitors.length === 2) {
                    var competitor1 = match.competitors[0];
                    var competitor2 = match.competitors[1];
                    if (competitor1 && competitor2) {
                        var listItem = new VSListItem();
                        listItem.competitor1 = {
                            imageURL: competitor1.logo,
                            name: competitor1.name
                        };
                        listItem.competitor2 = {
                            imageURL: competitor2.logo,
                            name: competitor2.name
                        };
                        var startDate = new Date(match.startDateTS);
                        listItem.date = startDate.toLocaleDateString();
                        listItem.time = _this.getTimeString(startDate);
                        listItem.sortKey = match.startDateTS;
                        _this._listItems.push(listItem);
                    }
                }
            });
        });
        this._listItems.sort(function (a, b) {
            return a.sortKey - b.sortKey;
        });
        this.render();
    };
    OverwatchLeague.prototype.getTimeString = function (date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var minutesString = (minutes < 10) ? "0" + minutes : minutes;
        var amPm = (hour > 12) ? "PM" : "AM";
        hour = hour % 12;
        hour = hour == 0 ? hour + 12 : hour;
        return hour + ":" + minutesString + " " + amPm;
    };
    return OverwatchLeague;
}(VSList));
