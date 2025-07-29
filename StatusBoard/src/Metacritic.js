"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetacriticColumn = void 0;
const react_1 = require("react");
const React = require("react");
const GDQEvents_1 = require("./GDQEvents");
const ShuffleInterval = 10 * 1000;
const MetacriticColumn = (props) => {
    var _a;
    const [currentIndex, setCurrentIndex] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => { var _a; return (prevIndex + 1) % (((_a = props.data) === null || _a === void 0 ? void 0 : _a.Components.length) || 1); });
        }, ShuffleInterval);
        return () => clearInterval(intervalId);
    }, [(_a = props.data) === null || _a === void 0 ? void 0 : _a.Components.length]);
    if (!props.data || !props.data.Components || props.data.Components.length === 0) {
        return null;
    }
    const component = props.data.Components[currentIndex];
    return React.createElement(MetacriticComponent, { component: component });
};
exports.MetacriticColumn = MetacriticColumn;
const MetacriticComponent = (props) => {
    var _a;
    const { component } = props;
    const items = (_a = component === null || component === void 0 ? void 0 : component.Items) !== null && _a !== void 0 ? _a : [];
    if (items.length === 0) {
        return null;
    }
    return React.createElement("div", { className: "metacritic-column" },
        React.createElement("div", { className: "title-card" }, component.Title),
        items.slice(0, 10).map((entry) => {
            return React.createElement("div", { key: entry.Title, className: "card" },
                React.createElement("img", { crossOrigin: "anonymous", src: entry.ImageSrc }),
                React.createElement("div", { className: "alt-line1" },
                    React.createElement(GDQEvents_1.ScrollingText, { text: entry.Title })),
                React.createElement("div", { className: "metascore" }, entry.Score),
                React.createElement(Metascore, { score: entry.Score }));
        }));
};
const Metascore = ({ score }) => {
    return React.createElement("span", { className: ["metascore", getMetacriticScoreColor(score)].join(" ") }, score);
};
const getMetacriticScoreColor = (score) => {
    let scoreNum = parseInt(score, 10);
    if (scoreNum >= 60) {
        return "green";
    }
    else if (scoreNum >= 40) {
        return "yellow";
    }
    return "red";
};
