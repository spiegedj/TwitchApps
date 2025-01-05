"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.GDQEvents = void 0;
const React = require("react");
const DateUtils_1 = require("./DateUtils");
class GDQEvents extends React.Component {
    render() {
        let tableRows = this.props.runs.map((run, index) => {
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
                    React.createElement("div", { className: "runGame" }, run.Game),
                    React.createElement("div", { className: "lighten" }, run.Category),
                    !isShort && React.createElement("div", { className: "lighten" }, run.Commentator))));
        });
        tableRows = tableRows.slice(0, 15);
        return (React.createElement("div", { className: "gdq col" }, tableRows));
    }
}
exports.GDQEvents = GDQEvents;
