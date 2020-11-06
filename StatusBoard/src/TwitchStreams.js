"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchStreams = void 0;
const React = require("react");
const GroupedList_1 = require("./GroupedList");
;
class TwitchStreams extends React.Component {
    constructor() {
        super(...arguments);
        this.createGroup = (item) => {
            return { name: item.Game, items: [], key: item.Game };
        };
        this.isGrouped = (a, b) => {
            return a.Game === b.Game;
        };
        this.getSize = (groups) => {
            var items = groups.reduce((items, group) => items.concat(...group.items), []);
            return items.length * 53 + groups.length * 50;
        };
    }
    render() {
        const groupedStreams = new GroupedList_1.IGroupedList();
        groupedStreams.createGroup = this.createGroup;
        groupedStreams.isGrouped = this.isGrouped;
        groupedStreams.getSize = this.getSize;
        const colCount = this.props.columns;
        const columns = [];
        let remainingItems = this.props.streams;
        for (let i = 0; (i < colCount && remainingItems.length > 0); i++) {
            groupedStreams.populate(remainingItems);
            const groupResponse = groupedStreams.getGroups(800);
            remainingItems = groupResponse.remainingItems;
            const tiles = groupResponse.groups.map((game) => {
                return React.createElement("div", { className: "list-group card" },
                    React.createElement("div", { className: "list-group-name" }, game.name),
                    game.items.map(stream => {
                        return React.createElement("div", { className: "tile" },
                            React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL }),
                            React.createElement("div", { className: "tile-title" }, stream.Streamer),
                            React.createElement("div", { className: "tile-details" }, stream.Status),
                            React.createElement("div", { className: "tile-viewers" }, this.__addCommas(stream.Viewers)));
                    }));
            });
            columns.push(React.createElement("div", { className: "streams list-container" }, tiles));
        }
        return columns;
    }
    __addCommas(num) {
        var numString = num.toString();
        var commaString = "";
        for (var i = numString.length; i > 3; i -= 3) {
            commaString = "," + numString.substr(Math.max(0, i - 3), i) + commaString;
        }
        commaString = numString.substr(0, i) + commaString;
        return commaString;
    }
}
exports.TwitchStreams = TwitchStreams;
