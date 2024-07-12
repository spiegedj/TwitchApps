"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmallPanel = exports.EsportTournaments = void 0;
const React = require("react");
const DateUtils_1 = require("./DateUtils");
;
const EsportTournaments = (props) => {
    const panels = [];
    let { tournaments, adjustColumns, columns } = props;
    tournaments = (tournaments || [])
        //.filter(match => match.TournamentName.includes("OWCS"))
        //.filter(match => DateUtils.isTodayOrInFuture(new Date(match.Date)))
        .filter(match => match.tier < 2 || match.matches.length > 0)
        .slice(0, 20);
    return React.createElement("div", { className: "ow col" }, tournaments.map(tournament => {
        return React.createElement("span", { className: "group-card" },
            React.createElement("div", { className: "group-card-header" },
                React.createElement(GameIcon, { tournament: tournament }),
                React.createElement("div", { className: "tournament" },
                    React.createElement("div", { className: "tournament-name" }, tournament.name),
                    React.createElement("div", { className: "date-header" }, tournament.dates)),
                React.createElement(TierBadge, { tier: tournament.tier })),
            tournament.matches
                .filter(m => DateUtils_1.DateUtils.isTodayOrTomorrow(new Date(m.Date)))
                .slice(0, 3)
                .map((m) => {
                return React.createElement(React.Fragment, null,
                    React.createElement(exports.SmallPanel, { match: m, isActive: false }));
            }));
    }));
    // const matchDays = splitByDay(matches);
    // const nextDay = matchDays.shift();
    // if (nextDay)
    // {
    // 	const nextMatch = nextDay.matches.find(m => !m.IsConcluded);
    // 	const extraDaysOnFirstPanel = matchDays.slice(0, 3);
    // 	let currentTournament = "";
    // 	panels.push(<div className="ow col">
    // 		<span className="group-card">
    // 			<div className="date-header">{DateUtils.getDayString(nextDay.date)}</div>
    // 			{nextDay.matches.map((m) =>
    // 			{
    // 				let showTournmanet = (currentTournament !== m.TournamentName);
    // 				currentTournament = m.TournamentName;
    // 				return <>
    // 					{showTournmanet && <div className="tournament">{currentTournament}</div>}
    // 					<SmallPanel match={m} isActive={m === nextMatch} />
    // 				</>;
    // 			})}
    // 		</span>
    // 		{
    // 			extraDaysOnFirstPanel.map(day =>
    // 				<span className="group-card">
    // 					<div className="date-header">{DateUtils.getDayString(day.date)}</div>
    // 					{day.matches.map(m =>
    // 					{
    // 						let showTournmanet = (currentTournament !== m.TournamentName);
    // 						currentTournament = m.TournamentName;
    // 						return <>
    // 							{showTournmanet && <div className="tournament">{currentTournament}</div>}
    // 							<SmallPanel match={m} />
    // 						</>;
    // 					})}
    // 				</span>
    // 			)
    // 		}
    // 	</div>);
    // }
    // adjustColumns(panels.length);
    // return <>{panels.slice(0, columns)}</>;
};
exports.EsportTournaments = EsportTournaments;
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
const GameIcon = ({ tournament }) => {
    if (tournament.game === "overwatch") {
        return React.createElement("img", { src: "./Images/ow.svg", className: "game-icon" });
    }
    return React.createElement("img", { src: "./Images/sc2.png", className: "game-icon" });
};
const TierBadge = ({ tier }) => {
    let tierName = "";
    switch (tier) {
        case 1:
            tierName = "Premier";
            break;
        case 2:
            tierName = "Major";
            break;
        case 3:
            tierName = "Minor";
            break;
        case 4:
            tierName = "Basic";
            break;
        default:
            tierName = "Misc";
            break;
    }
    return React.createElement("div", { className: `tier-badge tier${tier}` }, tierName);
};
function getImage(comp) {
    if (comp.Race) {
        return `./Images/${comp.Race}.png`;
    }
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
