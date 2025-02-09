"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallStreamCard = exports.StreamCard = exports.TwitchStreams = void 0;
const React = require("react");
const react_1 = require("react");
const Utils_1 = require("./Utils");
const GDQEvents_1 = require("./GDQEvents");
;
const MIN_TILE_WIDTH = 280;
const MIN_TILE_HEIGHT_L = 86;
const MIN_TILE_HEIGHT_S = 60;
exports.TwitchStreams = React.memo((props) => {
    const { streams } = props;
    const containerRef = (0, react_1.useRef)();
    const [containerWidth, setContainerWidth] = (0, react_1.useState)(1520);
    const [containerHeight, setContainerHeight] = (0, react_1.useState)(1520);
    const remeasure = () => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
            setContainerHeight(containerRef.current.offsetHeight);
        }
    };
    (0, react_1.useEffect)(() => {
        const timerId = window.setInterval(remeasure, 300);
        return () => {
            window.clearInterval(timerId);
        };
    }, []);
    let curCol = 0;
    let currentHeight = 0;
    let currentWidth = MIN_TILE_WIDTH;
    const tileWidth = containerWidth / Math.floor(containerWidth / MIN_TILE_WIDTH);
    let tileHeight;
    const followedStreams = streams;
    const newMap = [];
    for (let stream of followedStreams) {
        tileHeight = getTileHeight(containerHeight, currentHeight, stream.Followed);
        if (tileHeight === 0) {
            curCol++;
            currentHeight = 0;
            currentWidth += tileWidth;
            tileHeight = getTileHeight(containerHeight, currentHeight, stream.Followed);
            if (currentWidth > (containerWidth + 1)) {
                break;
            }
        }
        const x = curCol * tileWidth;
        const y = currentHeight;
        currentHeight += tileHeight;
        const card = stream.Followed
            ? React.createElement(exports.StreamCard, { stream: stream, height: tileHeight, x: x, y: y, width: tileWidth, key: stream.Streamer })
            : React.createElement(exports.SmallStreamCard, { stream: stream, height: tileHeight, x: x, y: y, width: tileWidth, key: stream.Streamer });
        newMap.push({ key: stream.Streamer, el: card });
    }
    const renderedOrder = (0, react_1.useRef)(new Map());
    newMap.sort((a, b) => {
        var _a, _b;
        const aIdx = (_a = renderedOrder.current.get(a.key)) !== null && _a !== void 0 ? _a : 100000;
        const bIdx = (_b = renderedOrder.current.get(b.key)) !== null && _b !== void 0 ? _b : 100000;
        return aIdx - bIdx;
    });
    renderedOrder.current = newMap.reduce((acc, el, idx) => acc.set(el.key, idx), new Map());
    return React.createElement("div", { className: "twitchStreams", ref: containerRef }, newMap.map(x => x.el));
}, (prev, next) => prev.hash === next.hash && prev.columns === next.columns);
function getTileHeight(containerHeight, currentHeight, isFollowed) {
    const minTileHeight = isFollowed ? MIN_TILE_HEIGHT_L : MIN_TILE_HEIGHT_S;
    const remainingHeight = containerHeight - currentHeight;
    if (remainingHeight <= 0) {
        return 0;
    }
    return remainingHeight / Math.floor(remainingHeight / minTileHeight);
}
const StreamCard = ({ stream, x, y, width, height }) => {
    const horMargin = 5;
    const vertMargin = 6;
    width -= horMargin;
    height -= vertMargin;
    return React.createElement("div", { className: "tile group-card tag-style", style: { top: y, left: x, width, height, margin: `${vertMargin}px ${horMargin}px` } },
        React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL }),
        React.createElement("div", null,
            React.createElement("div", { className: "tile-title" }, stream.Streamer),
            React.createElement("div", { className: "tile-game" },
                React.createElement(GDQEvents_1.ScrollingText, { text: stream.Game })),
            React.createElement("div", { className: "tile-details" },
                React.createElement(GDQEvents_1.ScrollingText, { text: stream.Status }))),
        React.createElement("div", { className: "tile-viewers" },
            React.createElement("span", { className: "live-indicator" }),
            React.createElement("span", null, (0, Utils_1.addCommas)(stream.Viewers))));
};
exports.StreamCard = StreamCard;
const SmallStreamCard = ({ stream, x, y, width, height }) => {
    const horMargin = 5;
    const vertMargin = 6;
    width -= horMargin;
    height -= vertMargin;
    return React.createElement("div", { className: "tile small group-card tag-style", style: { top: y, left: x, width, height, margin: `${vertMargin}px ${horMargin}px` } },
        React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL, style: { width: height } }),
        React.createElement("div", null,
            React.createElement("div", { className: "tile-title" }, stream.Streamer),
            React.createElement("div", { className: "tile-details" },
                React.createElement(GDQEvents_1.ScrollingText, { text: stream.Game })),
            React.createElement("div", { className: "tile-details" },
                React.createElement(GDQEvents_1.ScrollingText, { text: stream.Status }))),
        React.createElement("div", { className: "tile-viewers" },
            React.createElement("span", { className: "live-indicator" }),
            React.createElement("span", null, (0, Utils_1.addCommas)(stream.Viewers))));
};
exports.SmallStreamCard = SmallStreamCard;
