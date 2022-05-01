"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverwatchEvents = void 0;
const React = require("react");
const DateHeader_1 = require("./DateHeader");
const DateUtils_1 = require("./DateUtils");
;
const imageOverrides = {
    "philadelphia fusion": "Images/OWLOverrides/Fusion.svg",
    "houston outlaws": "Images/OWLOverrides/Outlaws.svg",
    "boston uprising": "Images/OWLOverrides/Uprising.svg",
    "hangzhou spark": "Images/OWLOverrides/Spark.svg",
};
class OverwatchEvents extends React.Component {
    splitByDay(matches) {
        const days = [];
        while (matches.length > 0) {
            const match = matches.shift();
            const matchDay = {
                date: new Date(match.Date),
                matches: [match]
            };
            for (var i = 0; i < matches.length; i++) {
                const iMatch = matches[i];
                if (DateUtils_1.DateUtils.onSameDay(matchDay.date, new Date(iMatch.Date))) {
                    matches.splice(i, 1);
                    matchDay.matches.push(iMatch);
                    i--;
                }
            }
            days.push(matchDay);
        }
        return days;
    }
    getLargePanel(match) {
        const compNamePieces1 = this.splitName(match.Competitor1.Name);
        const compNamePieces2 = this.splitName(match.Competitor2.Name);
        const status = (match.IsLive && match.Score) ? match.Score : DateUtils_1.DateUtils.getTimeString(new Date(match.Date));
        const comp1ClassNames = ["comp", "comp-1"];
        if (this.useBlackText(match.Competitor1))
            comp1ClassNames.push("blackText");
        const comp2ClassNames = ["comp", "comp-2"];
        if (this.useBlackText(match.Competitor2))
            comp2ClassNames.push("blackText");
        return React.createElement("div", { className: "largeTile" },
            React.createElement("div", { className: comp1ClassNames.join(" "), style: { backgroundColor: this.getColor(match.Competitor1) } },
                React.createElement("img", { src: this.getImage(match.Competitor1), className: "image" }),
                React.createElement("div", { className: "comp-name-1" }, compNamePieces1.piece1),
                React.createElement("div", { className: "comp-name-2" }, compNamePieces1.piece2)),
            React.createElement("span", { className: "status" }, status),
            React.createElement("div", { className: comp2ClassNames.join(" "), style: { backgroundColor: this.getColor(match.Competitor2) } },
                React.createElement("img", { src: this.getImage(match.Competitor2), className: "image" }),
                React.createElement("div", { className: "comp-name-1" },
                    " ",
                    compNamePieces2.piece1),
                React.createElement("div", { className: "comp-name-2" },
                    " ",
                    compNamePieces2.piece2)));
    }
    getSmallPanel(match) {
        const compNamePieces1 = this.splitName(match.Competitor1.Name);
        const compNamePieces2 = this.splitName(match.Competitor2.Name);
        const status = (match.IsLive && match.Score) ? match.Score : DateUtils_1.DateUtils.getTimeString(new Date(match.Date));
        const comp1ClassNames = ["comp", "comp-1"];
        if (this.useBlackText(match.Competitor1))
            comp1ClassNames.push("blackText");
        const comp2ClassNames = ["comp", "comp-2"];
        if (this.useBlackText(match.Competitor2))
            comp2ClassNames.push("blackText");
        return React.createElement("div", { className: "tile" },
            React.createElement("div", { className: comp1ClassNames.join(" "), style: { backgroundColor: this.getColor(match.Competitor1) } },
                React.createElement("img", { src: this.getImage(match.Competitor1), className: "image" }),
                React.createElement("div", { className: "comp-name" },
                    React.createElement("span", { className: "comp-name-1" }, compNamePieces1.piece1),
                    compNamePieces1.piece2)),
            React.createElement("div", { className: comp2ClassNames.join(" "), style: { backgroundColor: this.getColor(match.Competitor2) } },
                React.createElement("img", { src: this.getImage(match.Competitor2), className: "image" }),
                React.createElement("div", { className: "comp-name" },
                    React.createElement("span", { className: "comp-name-1" }, compNamePieces2.piece1),
                    compNamePieces2.piece2)),
            React.createElement("span", { className: "status" }, status));
    }
    render() {
        const panels = [];
        const matches = (this.props.matches || []).slice();
        const matchDays = this.splitByDay(matches);
        const nextDay = matchDays.shift();
        if (nextDay) {
            const nextMatch = nextDay.matches.find(m => !m.IsConcluded);
            const matchPanels = nextDay.matches.map((m) => {
                return m === nextMatch ? this.getLargePanel(m) : this.getSmallPanel(m);
            });
            const extraDaysOnFirstPanel = matchDays.slice(0, 2);
            panels.push(React.createElement("div", { className: "ow col" },
                React.createElement("span", { className: "group" },
                    React.createElement(DateHeader_1.DateHeader, { dates: [nextDay.date], showTimeCells: false }),
                    matchPanels),
                extraDaysOnFirstPanel.map(day => React.createElement("span", { className: "group" },
                    React.createElement(DateHeader_1.DateHeader, { dates: [day.date], showTimeCells: false }),
                    day.matches.map(m => this.getSmallPanel(m))))));
        }
        let nextMatches = matchDays.slice(1, 5);
        if (nextMatches.length > 0 && false) {
            panels.push(React.createElement("span", { className: "ow col" }, nextMatches.map(day => React.createElement("span", { className: "group" },
                React.createElement(DateHeader_1.DateHeader, { dates: [day.date], showTimeCells: false }),
                day.matches.map(m => this.getSmallPanel(m))))));
        }
        this.props.adjustColumns(panels.length);
        return panels.slice(0, this.props.columns);
    }
    getImage(competitor) {
        if (imageOverrides[competitor.Name.toLowerCase()]) {
            return imageOverrides[competitor.Name.toLowerCase()];
        }
        return competitor.ImageURL;
    }
    getColor(competitor) {
        return competitor.PrimaryColor;
    }
    useBlackText(competitor) {
        const { r, g, b } = this.getRGBComponents(this.getColor(competitor));
        const nThreshold = 105;
        const bgDelta = (r * 0.299) + (g * 0.587) + (b * 0.114);
        return ((255 - bgDelta) < nThreshold);
    }
    getRGBComponents(color) {
        const r = color.substring(1, 3);
        const g = color.substring(3, 5);
        const b = color.substring(5, 7);
        return {
            r: parseInt(r, 16),
            g: parseInt(g, 16),
            b: parseInt(b, 16)
        };
    }
    splitName(name) {
        const pieces = name.split(" ");
        const lastPiece = pieces.pop();
        return { piece1: pieces.join(" "), piece2: lastPiece };
    }
}
exports.OverwatchEvents = OverwatchEvents;
