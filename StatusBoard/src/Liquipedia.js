"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.EsportTournaments = void 0;
const React = require("react");
const react_1 = require("react");
const DateUtils_1 = require("./DateUtils");
;
const EsportTournaments = (props) => {
    let { tournaments } = props;
    const containerRef = (0, react_1.useRef)();
    const [numberToRender, setNumberToRender] = (0, react_1.useState)(5);
    const foundLimit = (0, react_1.useRef)(false);
    (0, react_1.useMemo)(() => {
        foundLimit.current = false;
        setNumberToRender(5);
    }, [tournaments]);
    const tournamentsToRender = prioritizeTournaments((tournaments || []), numberToRender);
    (0, react_1.useLayoutEffect)(() => {
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
            day.matches.map((m) => {
                return React.createElement(SmallPanel, { match: m });
            }));
    }));
};
const SmallPanel = ({ match }) => {
    const status = (match.score) ? match.score : DateUtils_1.DateUtils.getTimeString(new Date(match.date));
    const comp1ClassNames = ["comp", "comp-1"];
    const comp2ClassNames = ["comp", "comp-2"];
    const containerClassNames = ["tile"];
    if (match.isLive) {
        containerClassNames.push("active");
    }
    return React.createElement("div", { className: containerClassNames.join(" ") },
        React.createElement("div", { className: comp1ClassNames.join(" ") },
            React.createElement("div", { className: "comp-name" }, match.competitor1.name),
            React.createElement("img", { src: getImage(match.competitor1), className: "image" })),
        React.createElement("div", { className: comp2ClassNames.join(" ") },
            React.createElement("img", { src: getImage(match.competitor2), className: "image" }),
            React.createElement("div", { className: "comp-name" }, match.competitor2.name)),
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
    if (!tournament.dates || !tournament.startDate) {
        return null;
    }
    const firstDay = new Date(tournament.startDate);
    if (!tournament.isUpcoming) {
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
    if (tournaments.length === 0) {
        return tournaments;
    }
    tournaments = tournaments.map(t => { return Object.assign({}, t); });
    let matches = tournaments.reduce((matches, tournament) => {
        return matches.concat(tournament.matches.map(match => {
            return Object.assign(Object.assign({ tournament: tournament }, match), { tier: tournament.tier });
        }));
    }, []).filter(m => !m.isConcluded);
    tournaments.forEach(t => t.matches = []);
    let prioritizedElements = [...tournaments, ...matches]
        .sort(sortElements);
    prioritizedElements = prioritizedElements.slice(0, renderCount);
    prioritizedElements.forEach(match => {
        if (isMatch(match)) {
            match.tournament.matches.push(match);
        }
    });
    return prioritizedElements.filter(el => !isMatch(el));
}
function sortElements(a, b) {
    if (a.tier !== b.tier) {
        return a.tier - b.tier;
    }
    const aStartDate = getStartDate(a);
    const bStartDate = getStartDate(b);
    if (aStartDate !== bStartDate) {
        return aStartDate - bStartDate;
    }
    if (isTournament(a) && !isTournament(b)) {
        return -1;
    }
    if (!isTournament(a) && isTournament(b)) {
        return 1;
    }
    return 0;
}
function getStartDate(tournament) {
    if (isMatch(tournament)) {
        return tournament.date;
    }
    if (tournament.nextMatchDate !== undefined) {
        return tournament.nextMatchDate;
    }
    return 100000000000 + tournament.startDate;
}
function isMatch(a) {
    return a.hasOwnProperty("tournament");
}
function isTournament(a) {
    return a.hasOwnProperty("matches");
}
function getImage(comp) {
    if (comp.race) {
        return `./Images/${comp.race}.png`;
    }
    return window.location.href + comp.imageUrl;
}
function splitByDay(matches) {
    const days = [];
    matches = matches.slice();
    while (matches.length > 0) {
        const match = matches.shift();
        const matchDay = {
            date: new Date(match.date),
            matches: [match]
        };
        for (var i = 0; i < matches.length; i++) {
            const iMatch = matches[i];
            if (DateUtils_1.DateUtils.onSameDay(matchDay.date, new Date(iMatch.date))) {
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
