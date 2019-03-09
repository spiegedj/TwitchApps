"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class TwitchStreams extends React.Component {
    render() {
        const streams = this.props.streams;
        const groupedStreams = new IGroupedList();
        groupedStreams.createGroup = item => { return { name: item.Game, items: [] }; };
        groupedStreams.isGrouped = (a, b) => a.Game === b.Game;
        groupedStreams.populate(streams);
        const games = groupedStreams.getGroups(14);
        const tiles = games.map((game) => {
            return React.createElement("div", { className: "list-group card" },
                React.createElement("div", { className: "list-group-name" }, game.name),
                game.items.map(stream => {
                    return React.createElement("div", { className: "tile" },
                        React.createElement("img", { className: "tile-image", src: stream.ImageURL }),
                        React.createElement("div", { className: "tile-title" }, stream.Streamer),
                        React.createElement("div", { className: "tile-details" }, stream.Status),
                        React.createElement("div", { className: "tile-viewers" }, this.__addCommas(stream.Viewers)));
                }));
        });
        return React.createElement("div", { className: "streams list-container" }, tiles);
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
class IGroupedList {
    populate(items) {
        this.items = items;
    }
    getGroups(count) {
        const groups = [];
        let items = this.items.slice(0, count);
        while (items.length > 0) {
            const item = items.shift();
            const group = this.createGroup(item);
            group.items = [item];
            for (var i = 0; i < items.length; i++) {
                const iItem = items[i];
                if (this.isGrouped(item, iItem)) {
                    items.splice(i, 1);
                    group.items.push(iItem);
                    i--;
                }
            }
            groups.push(group);
        }
        return groups;
    }
}
