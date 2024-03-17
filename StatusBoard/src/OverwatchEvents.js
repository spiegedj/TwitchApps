"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallPanel = exports.LargePanel = exports.OverwatchEvents = void 0;
const React = require("react");
const DateUtils_1 = require("./DateUtils");
;
const OverwatchEvents = (props) => {
    const panels = [];
    let { matches, adjustColumns, columns } = props;
    matches = (matches || [])
        .filter(match => DateUtils_1.DateUtils.isTodayOrInFuture(new Date(match.Date)))
        .slice(0, 12);
    const matchDays = splitByDay(matches);
    const nextDay = matchDays.shift();
    if (nextDay) {
        const nextMatch = nextDay.matches.find(m => !m.IsConcluded);
        const extraDaysOnFirstPanel = matchDays.slice(0, 3);
        let currentTournament = "";
        panels.push(React.createElement("div", { className: "ow col" },
            React.createElement("span", { className: "group-card" },
                React.createElement("div", { className: "date-header" }, DateUtils_1.DateUtils.getDayString(nextDay.date)),
                nextDay.matches.map((m) => {
                    let showTournmanet = (currentTournament !== m.TournamentName);
                    currentTournament = m.TournamentName;
                    return React.createElement(React.Fragment, null,
                        showTournmanet && React.createElement("div", { className: "tournament" }, currentTournament),
                        React.createElement(exports.SmallPanel, { match: m, isActive: m === nextMatch }));
                })),
            extraDaysOnFirstPanel.map(day => React.createElement("span", { className: "group-card" },
                React.createElement("div", null, DateUtils_1.DateUtils.getDayString(day.date)),
                day.matches.map(m => {
                    let showTournmanet = (currentTournament !== m.TournamentName);
                    currentTournament = m.TournamentName;
                    return React.createElement(React.Fragment, null,
                        showTournmanet && React.createElement("div", null, currentTournament),
                        React.createElement(exports.SmallPanel, { match: m }));
                })))));
    }
    adjustColumns(panels.length);
    return React.createElement(React.Fragment, null, panels.slice(0, columns));
};
exports.OverwatchEvents = OverwatchEvents;
const LargePanel = ({ match }) => {
    const compNamePieces1 = splitName(match.Competitor1.Name);
    const compNamePieces2 = splitName(match.Competitor2.Name);
    const status = (match.Score) ? match.Score : DateUtils_1.DateUtils.getTimeString(new Date(match.Date));
    const comp1ClassNames = ["comp", "comp-1"];
    const comp2ClassNames = ["comp", "comp-2"];
    return React.createElement("div", { className: "largeTile" },
        React.createElement("div", { className: comp1ClassNames.join(" ") },
            React.createElement("img", { src: match.Competitor1.ImageURL, className: "image" }),
            React.createElement("div", { className: "comp-name-1" }, compNamePieces1.piece1),
            React.createElement("div", { className: "comp-name-2" }, compNamePieces1.piece2)),
        React.createElement("span", { className: "status" }, status),
        React.createElement("div", { className: comp2ClassNames.join(" ") },
            React.createElement("img", { src: match.Competitor2.ImageURL, className: "image" }),
            React.createElement("div", { className: "comp-name-1" },
                " ",
                compNamePieces2.piece1),
            React.createElement("div", { className: "comp-name-2" },
                " ",
                compNamePieces2.piece2)));
};
exports.LargePanel = LargePanel;
const SmallPanel = ({ match, isActive }) => {
    const status = (match.Score) ? match.Score : DateUtils_1.DateUtils.getTimeString(new Date(match.Date));
    const comp1ClassNames = ["comp", "comp-1"];
    const comp2ClassNames = ["comp", "comp-2"];
    const containerClassNames = ["tile"];
    if (isActive) {
        containerClassNames.push("active");
    }
    return React.createElement("div", { className: containerClassNames.join(" ") },
        React.createElement("div", { className: comp1ClassNames.join(" ") },
            React.createElement("div", { className: "comp-name" }, match.Competitor1.Name),
            React.createElement("img", { src: getImage(match.Competitor1), className: "image" })),
        React.createElement("div", { className: comp2ClassNames.join(" ") },
            React.createElement("img", { src: getImage(match.Competitor2), className: "image" }),
            React.createElement("div", { className: "comp-name" }, match.Competitor2.Name)),
        React.createElement("span", { className: "status" }, status));
};
exports.SmallPanel = SmallPanel;
function getImage(comp) {
    return window.location.href + comp.ImageURL;
}
function splitName(name) {
    const pieces = name.split(" ");
    const lastPiece = pieces.pop();
    return { piece1: pieces.join(" "), piece2: lastPiece };
}
function splitByDay(matches) {
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
