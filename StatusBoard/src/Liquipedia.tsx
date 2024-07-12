/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { DateUtils } from "./DateUtils";

interface owProps
{
	tournaments: Response.ITournament[];
	adjustColumns: (cols: number) => void;
	columns: number;
};

interface MatchDay
{
	date: Date,
	matches: Response.IMatchDetails[];
}

export const EsportTournaments: React.FunctionComponent<owProps> = (props) =>
{
	const panels: JSX.Element[] = [];
	let { tournaments, adjustColumns, columns } = props;

	tournaments = (tournaments || [])
		//.filter(match => match.TournamentName.includes("OWCS"))
		//.filter(match => DateUtils.isTodayOrInFuture(new Date(match.Date)))
		.filter(match => match.tier < 2 || match.matches.length > 0)
		.slice(0, 20);

	return <div className="ow col">
		{tournaments.map(tournament =>
		{
			return <span className="group-card">
				<div className="group-card-header">
					<GameIcon tournament={tournament} />
					<div className="tournament">
						<div className="tournament-name">{tournament.name}</div>
						<div className="date-header">{tournament.dates}</div>
					</div>
					<TierBadge tier={tournament.tier} />
				</div>
				{/* <div className="date-header">{DateUtils.getDayString(nextDay.date)}</div> */}
				{tournament.matches
					.filter(m => DateUtils.isTodayOrTomorrow(new Date(m.Date)))
					.slice(0, 3)
					.map((m) =>
					{
						return <>
							<SmallPanel match={m} isActive={false} />
						</>;
					})}
			</span>;
		})}
	</div>;

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

export const SmallPanel: React.FunctionComponent<{ match: Response.IMatchDetails, isActive?: boolean; }> = ({ match, isActive }) =>
{
	const status = (match.Score) ? match.Score : DateUtils.getTimeString(new Date(match.Date));

	const comp1ClassNames = ["comp", "comp-1"];
	const comp2ClassNames = ["comp", "comp-2"];

	const containerClassNames = ["tile"];
	if (isActive)
	{
		containerClassNames.push("active");
	}

	return <div className={containerClassNames.join(" ")}>
		<div className={comp1ClassNames.join(" ")}>
			<div className="comp-name">{match.Competitor1.Name}</div>
			<img src={getImage(match.Competitor1)} className="image" />
		</div>
		<div className={comp2ClassNames.join(" ")}>
			<img src={getImage(match.Competitor2)} className="image" />
			<div className="comp-name">{match.Competitor2.Name}</div>
		</div>
		<span className="status">{status}</span>
	</div>;
};

const GameIcon: React.FunctionComponent<{ tournament: Response.ITournament; }> = ({ tournament }) =>
{
	if (tournament.game === "overwatch")
	{
		return <img src="./Images/ow.svg" className="game-icon" />;
	}
	return <img src="./Images/sc2.png" className="game-icon" />;
};

const TierBadge: React.FunctionComponent<{ tier: number; }> = ({ tier }) =>
{
	let tierName = "";
	switch (tier)
	{
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

	return <div className={`tier-badge tier${tier}`}>{tierName}</div>;
};

function getImage(comp: Response.CompetitorDetails): string
{
	if (comp.Race)
	{
		return `./Images/${comp.Race}.png`;
	}

	return window.location.href + comp.ImageURL;
}

function splitName(name: string): { piece1: string, piece2: string; }
{
	const pieces = name.split(" ");
	const lastPiece = pieces.pop();
	return { piece1: pieces.join(" "), piece2: lastPiece };
}

function splitByDay(matches: Response.IMatchDetails[]): MatchDay[]
{
	const days: MatchDay[] = [];
	while (matches.length > 0)
	{
		const match = matches.shift();
		const matchDay: MatchDay = {
			date: new Date(match.Date),
			matches: [match]
		};

		for (var i = 0; i < matches.length; i++)
		{
			const iMatch = matches[i];
			if (DateUtils.onSameDay(matchDay.date, new Date(iMatch.Date)))
			{
				matches.splice(i, 1);
				matchDay.matches.push(iMatch);
				i--;
			}
		}

		days.push(matchDay);
	}
	return days;
}