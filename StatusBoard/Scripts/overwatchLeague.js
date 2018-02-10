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
        _this.__flipColorsList = [
            "BOSTON UPRISING",
            "SAN FRANCISCO SHOCK",
            "HOUSTON OUTLAWS"
        ];
        _this.retrieveItems();
        _this.setBackgroundColor("#999999");
        _this.element.style.color = "#333333";
        return _this;
    }
    OverwatchLeague.prototype.__flipColors = function (competitor) {
        if (this.__flipColorsList.indexOf(competitor.name.toUpperCase()) > -1) {
            var swap = competitor.primaryColor;
            competitor.primaryColor = competitor.secondaryColor;
            competitor.secondaryColor = swap;
        }
    };
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
                            imageURL: competitor1.icon,
                            name: competitor1.name.toUpperCase(),
                            primaryColor: competitor1.primaryColor,
                            secondaryColor: competitor1.secondaryColor,
                        };
                        listItem.competitor2 = {
                            imageURL: competitor2.icon,
                            name: competitor2.name.toUpperCase(),
                            primaryColor: competitor2.primaryColor,
                            secondaryColor: competitor2.secondaryColor,
                        };
                        _this.__flipColors(listItem.competitor1);
                        _this.__flipColors(listItem.competitor2);
                        var startDate = new Date(match.startDateTS);
                        var endDate = new Date(match.endDateTS);
                        listItem.date = startDate.toLocaleDateString();
                        var now = new Date().getTime();
                        if (now > match.startDateTS && now < match.endDateTS) {
                            listItem.time = match.scores[0].value + " - " + match.scores[1].value;
                            listItem.live = true;
                        }
                        else {
                            listItem.time = _this.getTimeString(startDate);
                        }
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
