"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.GDQEvents = void 0;
const React = require("react");
const DateUtils_1 = require("./DateUtils");
class GDQEvents extends React.Component {
    render() {
        let tableRows = this.props.runs.map((run) => {
            const runDate = new Date(run.Date);
            const endDate = new Date(run.EndDate);
            const isLive = DateUtils_1.DateUtils.isLive(runDate, endDate);
            return (React.createElement("tr", { className: (isLive ? "live underline" : "underline") },
                React.createElement("td", null,
                    React.createElement("img", { src: run.GameImage, className: "game-image" })),
                React.createElement("td", { className: "rightAlign runDate" },
                    React.createElement("div", null, DateUtils_1.DateUtils.getTimeString(runDate)),
                    React.createElement("div", { className: "lighten" }, run.TimeEstimate)),
                React.createElement("td", { className: "runGame" },
                    React.createElement("div", null, run.Game),
                    React.createElement("div", { className: "lighten" }, run.Category)),
                React.createElement("td", { className: "runner" },
                    React.createElement("div", null, run.Runner),
                    React.createElement("div", { className: "lighten" }, run.Commentator))));
        });
        tableRows = tableRows.slice(0, 15);
        return (React.createElement("div", { className: "gdq col" },
            React.createElement("table", null,
                React.createElement("tbody", null, tableRows))));
    }
}
exports.GDQEvents = GDQEvents;
