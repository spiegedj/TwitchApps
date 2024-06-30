"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallStreamCard = exports.StreamCard = exports.TwitchStreams = void 0;
const React = require("react");
const react_1 = require("react");
const Utils_1 = require("./Utils");
const GroupedList_1 = require("./GroupedList");
;
const MIN_TILE_WIDTH = 280;
const MIN_TILE_HEIGHT_L = 84;
const MIN_TILE_HEIGHT_S = 48;
const createGroup = (item) => {
    return { name: item.Game, items: [], key: item.Game };
};
const isGrouped = (a, b) => {
    return a.Game === b.Game;
};
const getSize = (groups) => {
    var items = groups.reduce((items, group) => items.concat(...group.items), []);
    return (items.length * (MIN_TILE_HEIGHT_S + 3)) + (groups.length * 30);
};
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
    });
    const rows = [];
    let currentRow = [];
    let currentHeight = 0;
    let currentWidth = MIN_TILE_WIDTH;
    const followedStreams = streams.filter(s => s.Followed);
    for (let stream of followedStreams) {
        const tileHeight = MIN_TILE_HEIGHT_L + 4;
        const tileWidth = MIN_TILE_WIDTH + 10;
        if ((currentHeight + tileHeight) >= (containerHeight + 1)) {
            rows.push(React.createElement(StreamColumn, { children: currentRow }));
            currentRow = [];
            currentHeight = 0;
            currentWidth += tileWidth;
            if (currentWidth > (containerWidth + 1)) {
                break;
            }
        }
        currentHeight += tileHeight;
        currentRow.push(React.createElement(exports.StreamCard, { stream: stream, tileHeight: tileHeight }));
    }
    let remainingStreams = streams.filter(s => !s.Followed);
    const groupedStreams = new GroupedList_1.IGroupedList();
    groupedStreams.createGroup = createGroup;
    groupedStreams.isGrouped = isGrouped;
    groupedStreams.getSize = getSize;
    while (currentWidth < (containerWidth + 1)) {
        groupedStreams.populate(remainingStreams);
        const remainingHeight = containerHeight - currentHeight;
        const grouped = groupedStreams.getGroups(remainingHeight);
        const tileWidth = MIN_TILE_WIDTH + 10;
        const tiles = grouped.groups.map((game) => {
            return React.createElement("div", { className: "group-card" },
                React.createElement("div", { className: "list-group-name" }, game.name),
                game.items.map(stream => {
                    return React.createElement(exports.SmallStreamCard, { stream: stream, tileHeight: MIN_TILE_HEIGHT_S });
                }));
        });
        currentRow = currentRow.concat(tiles);
        rows.push(React.createElement(StreamColumn, { children: currentRow }));
        currentRow = [];
        currentHeight = 0;
        currentWidth += tileWidth;
        remainingStreams = grouped.remainingItems;
    }
    if (currentRow.length > 0) {
        rows.push(React.createElement(StreamColumn, { children: currentRow }));
    }
    return React.createElement("div", { className: "twitchStreams", ref: containerRef }, rows);
};
exports.TwitchStreams = TwitchStreams;
const StreamColumn = ({ children }) => {
    return React.createElement("div", { className: "group", style: { minWidth: MIN_TILE_WIDTH } }, children);
};
const StreamCard = ({ stream, tileHeight }) => {
    return React.createElement("div", { className: "tile group-card tag-style", style: { minHeight: tileHeight } },
        React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL }),
        React.createElement("div", null,
            React.createElement("div", { className: "tile-title" }, stream.Streamer),
            React.createElement("div", { className: "tile-game" }, stream.Game),
            React.createElement("div", { className: "tile-details" }, stream.Status)),
        React.createElement("div", { className: "tile-viewers" },
            React.createElement("span", { className: "live-indicator" }),
            React.createElement("span", null, (0, Utils_1.addCommas)(stream.Viewers))));
};
exports.StreamCard = StreamCard;
const SmallStreamCard = ({ stream, tileHeight }) => {
    return React.createElement("div", { className: "tile small", style: { minHeight: tileHeight } },
        React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: stream.ImageURL, style: { width: tileHeight } }),
        React.createElement("div", { className: "tile-title" }, stream.Streamer),
        React.createElement("div", { className: "tile-details" }, stream.Status),
        React.createElement("div", { className: "tile-viewers" },
            React.createElement("span", { className: "live-indicator" }),
            React.createElement("span", null, (0, Utils_1.addCommas)(stream.Viewers))));
};
exports.SmallStreamCard = SmallStreamCard;
