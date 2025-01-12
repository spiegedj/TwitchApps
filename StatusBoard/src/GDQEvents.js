"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollingText = exports.GDQEvents = void 0;
const React = require("react");
const react_1 = require("react");
const DateUtils_1 = require("./DateUtils");
const GDQEvents = (props) => {
    let tableRows = props.runs.map((run, index) => {
        const runDate = new Date(run.Date);
        const isLive = run.IsLive;
        const isShort = index > 3;
        const rowClasses = ["row"];
        isLive && rowClasses.push("live");
        isShort && rowClasses.push("short");
        return (React.createElement("div", { className: rowClasses.join(" ") },
            React.createElement("div", { className: "imageCol" },
                React.createElement("img", { src: run.GameImage, className: "game-image" })),
            React.createElement("div", { className: "rightAlign timeCol" },
                React.createElement("div", null, DateUtils_1.DateUtils.getTimeString(runDate)),
                React.createElement("div", { className: "lighten" }, run.TimeEstimate),
                !isShort && React.createElement("div", { className: "lighten" }, run.Runner)),
            React.createElement("div", { className: "runGame-cell mainCol" },
                React.createElement(exports.ScrollingText, { text: run.Game }),
                React.createElement("div", { className: "lighten" }, run.Category),
                !isShort && React.createElement("div", { className: "lighten" }, run.Commentator))));
    });
    tableRows = tableRows.slice(0, 15);
    return (React.createElement("div", { className: "gdq col" }, tableRows));
};
exports.GDQEvents = GDQEvents;
const DELAY_AFTER_SCROLL = 2 * 1000;
const DELAY_BEFORE_SCROLL = 10 * 1000;
const SPEED = 30;
const ScrollingText = (props) => {
    const { text } = props;
    const textContainer = (0, react_1.useRef)();
    const timerHandle = (0, react_1.useRef)();
    const currentX = (0, react_1.useRef)(0);
    const animate = (0, react_1.useCallback)((previousTimestamp) => {
        const el = textContainer.current;
        if (!el) {
            return;
        }
        const timestamp = Date.now();
        const delta = (timestamp - previousTimestamp) / SPEED;
        let x = (currentX.current - delta);
        if (-x > (el.scrollWidth - el.clientWidth + 10)) {
            currentX.current = 0;
            timerHandle.current = setTimeout(startAnimation, DELAY_AFTER_SCROLL);
            return;
        }
        setPosition(x);
        currentX.current = x;
        timerHandle.current = requestAnimationFrame(() => animate(timestamp));
    }, []);
    const startAnimation = (0, react_1.useCallback)(() => {
        stopAnimation();
        timerHandle.current = setTimeout(() => {
            timerHandle.current = requestAnimationFrame(() => animate(Date.now()));
        }, DELAY_BEFORE_SCROLL);
    }, []);
    const stopAnimation = (0, react_1.useCallback)(() => {
        setPosition(0);
        cancelAnimationFrame(timerHandle.current);
        clearTimeout(timerHandle.current);
        timerHandle.current = undefined;
    }, []);
    const setPosition = (0, react_1.useCallback)((x) => {
        if (textContainer.current) {
            textContainer.current.style.transform = `translateX(${x}px)`;
        }
    }, []);
    (0, react_1.useEffect)(() => {
        const el = textContainer.current;
        if (el && (el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight)) {
            startAnimation();
        }
        else {
            stopAnimation();
        }
    }, [textContainer, text]);
    return React.createElement("div", { className: "scrolling-text" },
        React.createElement("div", { ref: textContainer, className: "scroll" }, text));
};
exports.ScrollingText = ScrollingText;
