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
const MIN_TILE_HEIGHT_L = 84;
const MIN_TILE_HEIGHT_S = 48;
const TwitchStreams = (props) => {
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
    let curRow = -1;
    let children = [];
    let currentHeight = 0;
    let currentWidth = MIN_TILE_WIDTH;
    // const [a, setIsSmall] = useState(false);
    // useEffect(() =>
    // {
    // 	const timerId = window.setInterval(() =>
    // 	{
    // 		setIsSmall(!a);
    // 	}, 2000);
    // 	return () =>
    // 	{
    // 		window.clearInterval(timerId);
    // 	};
    // });
    const tileWidth = containerWidth / Math.floor(containerWidth / MIN_TILE_WIDTH);
    const tileHeight = containerHeight / Math.floor(containerHeight / MIN_TILE_HEIGHT_L);
    const followedStreams = streams.filter(s => s.Followed);
    const newMap = [];
    for (let stream of followedStreams) {
        if ((currentHeight + tileHeight) >= (containerHeight + 1)) {
            curCol++;
            currentHeight = 0;
            currentWidth += tileWidth;
            curRow = -1;
            if (currentWidth > (containerWidth + 1)) {
                break;
            }
        }
        curRow++;
        currentHeight += tileHeight;
        const x = curCol * tileWidth;
        const y = curRow * tileHeight;
        children.push(React.createElement(exports.StreamCard, { stream: stream, height: tileHeight, x: x, y: y, width: tileWidth, key: stream.Streamer }));
        newMap.push({ key: stream.Streamer, el: React.createElement(exports.StreamCard, { stream: stream, height: tileHeight, x: x, y: y, width: tileWidth, key: stream.Streamer }) });
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
};
exports.TwitchStreams = TwitchStreams;
const StreamColumn = ({ children }) => {
    return React.createElement("div", { className: "group", style: { minWidth: MIN_TILE_WIDTH } }, children);
};
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
const SmallStreamCard = ({ stream, height }) => {
    return React.createElement("div", { className: "tile small", style: { minHeight: height } },
        React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL, style: { width: height } }),
        React.createElement("div", { className: "tile-title" }, stream.Streamer),
        React.createElement("div", { className: "tile-details" }, stream.Status),
        React.createElement("div", { className: "tile-viewers" },
            React.createElement("span", { className: "live-indicator" }),
            React.createElement("span", null, (0, Utils_1.addCommas)(stream.Viewers))));
};
exports.SmallStreamCard = SmallStreamCard;
