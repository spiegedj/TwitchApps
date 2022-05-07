"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallStreamCard = exports.StreamCard = exports.TwitchStreams = void 0;
const React = require("react");
const react_1 = require("react");
const Utils_1 = require("./Utils");
;
const MIN_TILE_WIDTH = 280;
const MIN_TILE_HEIGHT_L = 80;
const MIN_TILE_HEIGHT_S = 60;
exports.TwitchStreams = (props) => {
    const { streams } = props;
    const containerRef = react_1.useRef();
    const [containerWidth, setContainerWidth] = react_1.useState(1520);
    const [containerHeight, setContainerHeight] = react_1.useState(1520);
    const remeasure = () => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
            setContainerHeight(containerRef.current.offsetHeight);
        }
    };
    react_1.useEffect(() => {
        const timerId = window.setInterval(remeasure, 300);
        return () => {
            window.clearInterval(timerId);
        };
    });
    const rows = [];
    let currentRow = [];
    let currentHeight = 0;
    let currentWidth = MIN_TILE_WIDTH;
    for (let stream of streams) {
        const shouldEmphasize = stream.Followed;
        const tileHeight = shouldEmphasize ? MIN_TILE_HEIGHT_L : MIN_TILE_HEIGHT_S;
        const tileWidth = MIN_TILE_WIDTH + 10;
        if ((currentHeight + tileHeight) >= (containerHeight + 1)) {
            rows.push(React.createElement("div", { className: "group", style: { minWidth: MIN_TILE_WIDTH } }, currentRow));
            currentRow = [];
            currentHeight = 0;
            currentWidth += tileWidth;
            if (currentWidth > (containerWidth + 1)) {
                break;
            }
        }
        currentHeight += tileHeight;
        currentRow.push(shouldEmphasize
            ? React.createElement(exports.StreamCard, { stream: stream, tileHeight: tileHeight })
            : React.createElement(exports.SmallStreamCard, { stream: stream, tileHeight: tileHeight }));
    }
    if (currentRow.length > 0) {
        rows.push(React.createElement("div", { className: "group", style: { minWidth: MIN_TILE_WIDTH } }, currentRow));
    }
    return React.createElement("div", { className: "twitchStreams", ref: containerRef }, rows);
};
exports.StreamCard = ({ stream, tileHeight }) => {
    return React.createElement("div", { className: "tile card", style: { minHeight: tileHeight } },
        React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL }),
        React.createElement("div", { className: "tile-title" }, stream.Streamer),
        React.createElement("div", { className: "tile-game" }, stream.Game),
        React.createElement("div", { className: "tile-details" }, stream.Status),
        React.createElement("div", { className: "tile-viewers" },
            React.createElement("span", { className: "live-indicator" }),
            React.createElement("span", null, Utils_1.addCommas(stream.Viewers))));
};
exports.SmallStreamCard = ({ stream, tileHeight }) => {
    return React.createElement("div", { className: "tile card small", style: { minHeight: tileHeight } },
        React.createElement("div", { className: "inner" },
            React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL }),
            React.createElement("div", { className: "tile-title" }, stream.Streamer),
            React.createElement("div", { className: "tile-game" }, stream.Game)),
        React.createElement("div", { className: "tile-details" }, stream.Status),
        React.createElement("div", { className: "tile-viewers" },
            React.createElement("span", { className: "live-indicator" }),
            React.createElement("span", null, Utils_1.addCommas(stream.Viewers))));
};
