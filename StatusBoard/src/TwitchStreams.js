"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchStreams = void 0;
const React = require("react");
;
let canvas = null;
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    canvas = canvas || document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return Math.ceil(metrics.width);
}
const MAX_WIDTH = 300;
function getStreamWidth(stream) {
    return 250;
    const titleWidth = getTextWidth(stream.Streamer, "17pt Industry");
    const gameWidth = getTextWidth(stream.Game, "12pt Industry");
    const statusWidth = (getTextWidth(stream.Status, "9pt Industry") / 2);
    return Math.min(Math.max(titleWidth, statusWidth, gameWidth) + 82 + 5 + 2, MAX_WIDTH);
}
function addCommas(num) {
    var numString = num.toString();
    var commaString = "";
    for (var i = numString.length; i > 3; i -= 3) {
        commaString = "," + numString.substr(Math.max(0, i - 3), i) + commaString;
    }
    commaString = numString.substr(0, i) + commaString;
    return commaString;
}
exports.TwitchStreams = (props) => {
    const { streams } = props;
    const rows = [];
    const totalWidth = 1520;
    let currentRow = [];
    let currentWidth = 0;
    for (let stream of streams) {
        const width = getStreamWidth(stream);
        if ((currentWidth + width) > totalWidth) {
            rows.push(React.createElement("div", { className: "horizontal-list" }, currentRow));
            currentRow = [];
            currentWidth = 0;
        }
        currentWidth += width;
        currentRow.push(React.createElement("div", { className: "tile card", style: { flexBasis: width } },
            React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL }),
            React.createElement("div", { className: "tile-title" }, stream.Streamer),
            React.createElement("div", { className: "tile-game" }, stream.Game),
            React.createElement("div", { className: "tile-details" }, stream.Status),
            React.createElement("div", { className: "tile-viewers" },
                React.createElement("span", { className: "live-indicator" }),
                React.createElement("span", null, addCommas(stream.Viewers)))));
    }
    rows.push(React.createElement("div", { className: "horizontal-list" }, currentRow));
    return React.createElement("div", { className: "horizontal-lists", style: { width: totalWidth } }, rows);
};
