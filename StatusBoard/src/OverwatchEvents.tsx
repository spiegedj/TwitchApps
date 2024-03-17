/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { DateHeader } from "./DateHeader";
import { DateUtils } from "./DateUtils";

interface owProps
{
	matches: Response.MatchDetails[];
	adjustColumns: (cols: number) => void;
	columns: number;
};

interface MatchDay
{
	date: Date,
	matches: Response.MatchDetails[];
}

export const OverwatchEvents: React.FunctionComponent<owProps> = (props) =>
{
	const panels: JSX.Element[] = [];
	let { matches, adjustColumns, columns } = props;

	matches = (matches || [])
		.filter(match => DateUtils.isTodayOrInFuture(new Date(match.Date)))
		.slice(0, 12);

	const matchDays = splitByDay(matches);
	const nextDay = matchDays.shift();
	if (nextDay)
	{
		const nextMatch = nextDay.matches.find(m => !m.IsConcluded);

		const extraDaysOnFirstPanel = matchDays.slice(0, 3);
		let currentTournament = "";

		panels.push(<div className="ow col">
			<span className="group-card">
				<div className="date-header">{DateUtils.getDayString(nextDay.date)}</div>
				{nextDay.matches.map((m) =>
				{
					let showTournmanet = (currentTournament !== m.TournamentName);
					currentTournament = m.TournamentName;
					return <>
						{showTournmanet && <div className="tournament">{currentTournament}</div>}
						<SmallPanel match={m} isActive={m === nextMatch} />
					</>;
				})}
			</span>
			{
				extraDaysOnFirstPanel.map(day =>
					<span className="group-card">
						<div>{DateUtils.getDayString(day.date)}</div>
						{day.matches.map(m =>
						{
							let showTournmanet = (currentTournament !== m.TournamentName);
							currentTournament = m.TournamentName;
							return <>
								{showTournmanet && <div>{currentTournament}</div>}
								<SmallPanel match={m} />
							</>;
						})}
					</span>
				)
			}
		</div>);
	}

	adjustColumns(panels.length);

	return <>{panels.slice(0, columns)}</>;
};

export const LargePanel: React.FunctionComponent<{ match: Response.MatchDetails; }> = ({ match }) =>
{
	const compNamePieces1 = splitName(match.Competitor1.Name);
	const compNamePieces2 = splitName(match.Competitor2.Name);

	const status = (match.Score) ? match.Score : DateUtils.getTimeString(new Date(match.Date));

	const comp1ClassNames = ["comp", "comp-1"];
	const comp2ClassNames = ["comp", "comp-2"];

	return <div className="largeTile">
		<div className={comp1ClassNames.join(" ")}>
			<img src={match.Competitor1.ImageURL} className="image" />
			<div className="comp-name-1">{compNamePieces1.piece1}</div>
			<div className="comp-name-2">{compNamePieces1.piece2}</div>
		</div>
		<span className="status">{status}</span>
		<div className={comp2ClassNames.join(" ")}>
			<img src={match.Competitor2.ImageURL} className="image" />
			<div className="comp-name-1"> {compNamePieces2.piece1}</div>
			<div className="comp-name-2"> {compNamePieces2.piece2}</div>
		</div>
	</div>;
};

export const SmallPanel: React.FunctionComponent<{ match: Response.MatchDetails, isActive?: boolean; }> = ({ match, isActive }) =>
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
			<img src={match.Competitor1.ImageURL} className="image" />
		</div>
		<div className={comp2ClassNames.join(" ")}>
			<img src={match.Competitor2.ImageURL} className="image" />
			<div className="comp-name">{match.Competitor2.Name}</div>
		</div>
		<span className="status">{status}</span>
	</div>;
};

function splitName(name: string): { piece1: string, piece2: string; }
{
	const pieces = name.split(" ");
	const lastPiece = pieces.pop();
	return { piece1: pieces.join(" "), piece2: lastPiece };
}

function splitByDay(matches: Response.MatchDetails[]): MatchDay[]
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