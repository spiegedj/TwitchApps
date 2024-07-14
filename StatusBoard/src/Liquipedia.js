"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.EsportTournaments = void 0;
const React = require("react");
const react_1 = require("react");
const DateUtils_1 = require("./DateUtils");
;
const EsportTournaments = (props) => {
    let { tournaments, adjustColumns, columns } = props;
    const containerRef = (0, react_1.useRef)();
    const [numberToRender, setNumberToRender] = (0, react_1.useState)(5);
    const foundLimit = (0, react_1.useRef)(false);
    (0, react_1.useMemo)(() => {
        foundLimit.current = false;
        setNumberToRender(5);
    }, [tournaments]);
    const tournamentsToRender = prioritizeTournaments((tournaments || []), numberToRender);
    //.filter(match => match.TournamentName.includes("OWCS"))
    //.filter(match => DateUtils.isTodayOrInFuture(new Date(match.Date)))
    //.filter(match => match.tier < 2 || match.matches.length > 0)
    //.slice(0, numberToRender);
    (0, react_1.useEffect)(() => {
        if (containerRef.current && !foundLimit.current) {
            if (!isOverflown(containerRef.current) && tournaments.length > numberToRender) {
                setNumberToRender(numberToRender + 1);
            }
            else {
                foundLimit.current = true;
                setNumberToRender(numberToRender - 1);
            }
        }
    }, [tournaments, containerRef, numberToRender]);
    return React.createElement("div", { className: "ow col", ref: containerRef }, tournamentsToRender.map(tournament => {
        return React.createElement("span", { className: "group-card" },
            React.createElement("div", { className: "group-card-header" },
                React.createElement(GameIcon, { tournament: tournament }),
                React.createElement("div", { className: "tournament" },
                    React.createElement("div", { className: "tournament-name" }, tournament.name),
                    React.createElement("div", { className: "date-header" },
                        React.createElement(Countdown, { tournament: tournament }))),
                React.createElement(TierBadge, { tournament: tournament })),
            React.createElement(MatchList, { tournament: tournament }));
    }));
};
exports.EsportTournaments = EsportTournaments;
const MatchList = ({ tournament }) => {
    const matchDays = splitByDay(tournament.matches);
    return React.createElement(React.Fragment, null, matchDays.map(day => {
        return React.createElement("div", null,
            React.createElement("div", { className: "day-header" }, DateUtils_1.DateUtils.getDayString(day.date)),
            day.matches.filter(m => !m.IsConcluded).map((m) => {
                return React.createElement(SmallPanel, { match: m, isActive: false });
            }));
    }));
};
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
const GameIcon = ({ tournament }) => {
    if (tournament.game === "overwatch") {
        return React.createElement("img", { src: "./Images/ow.svg", className: "game-icon" });
    }
    return React.createElement("img", { src: "./Images/sc2.png", className: "game-icon" });
};
const TierBadge = ({ tournament }) => {
    return React.createElement("div", { className: `tier-badge tier${tournament.tier}` }, tournament.tierName);
};
const Countdown = ({ tournament }) => {
    if (!tournament.dates) {
        return null;
    }
    const firstDay = new Date(tournament.dates.split("-")[0]);
    if (!firstDay.valueOf()) {
        return null;
    }
    firstDay.setFullYear(new Date().getFullYear());
    if (DateUtils_1.DateUtils.isTodayOrInPast(firstDay)) {
        return React.createElement("span", null,
            "Ongoing (",
            tournament.dates,
            ")");
    }
    return React.createElement("span", null,
        DateUtils_1.DateUtils.getCountdownString(firstDay),
        " (",
        tournament.dates,
        ")");
};
function prioritizeTournaments(tournaments, renderCount) {
    const sortedTournaments = tournaments
        .slice()
        .sort(sortTournaments)
        .map(t => { return Object.assign({}, t); });
    let sortedMatches = sortedTournaments.reduce((matches, tournament) => {
        return matches.concat(tournament.matches.map(match => {
            return Object.assign({ tournament: tournament }, match);
        }));
    }, []);
    sortedMatches = sortedMatches
        .filter(m => !m.IsConcluded)
        .sort((a, b) => { var _a, _b; return ((_a = a.tournament.tier) !== null && _a !== void 0 ? _a : 6) - ((_b = b.tournament.tier) !== null && _b !== void 0 ? _b : 6); });
    sortedTournaments.forEach(t => t.matches = []);
    let addedCount = 0;
    let prioritizedTournaments = [];
    while (addedCount < renderCount && (sortedTournaments.length > 0 || sortedMatches.length > 0)) {
        const nextTournament = sortedTournaments[0];
        let nextMatch = sortedMatches[0];
        addedCount++;
        if (nextTournament && (!nextMatch || nextTournament.tier <= nextMatch.tournament.tier)) {
            prioritizedTournaments.push(sortedTournaments.shift());
        }
        else if (nextMatch) {
            nextMatch = sortedMatches.shift();
            nextMatch.tournament.matches.push(nextMatch);
        }
    }
    return prioritizedTournaments;
}
function sortTournaments(a, b) {
    var _a, _b, _c, _d;
    if (a.tier === b.tier) {
        return ((_a = getStartDate(a)) === null || _a === void 0 ? void 0 : _a.valueOf()) - ((_b = getStartDate(b)) === null || _b === void 0 ? void 0 : _b.valueOf());
    }
    return ((_c = a.tier) !== null && _c !== void 0 ? _c : 6) - ((_d = b.tier) !== null && _d !== void 0 ? _d : 6);
}
function getStartDate(tournament) {
    if (!tournament.dates) {
        return null;
    }
    const startDate = new Date(tournament.dates.split("-")[0]);
    if (!startDate.valueOf()) {
        return null;
    }
    startDate.setFullYear(new Date().getFullYear());
    return startDate;
}
function getImage(comp) {
    if (comp.Race) {
        return `./Images/${comp.Race}.png`;
    }
    return window.location.href + comp.ImageURL;
}
function splitByDay(matches) {
    const days = [];
    matches = matches.slice();
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
function isOverflown(element) {
    return element.scrollHeight > element.clientHeight;
}
