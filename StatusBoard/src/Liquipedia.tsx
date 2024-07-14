/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { FunctionComponent, useEffect, useRef, useMemo, useState } from "react";
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

export const EsportTournaments: FunctionComponent<owProps> = (props) =>
{
	let { tournaments, adjustColumns, columns } = props;

	const containerRef = useRef<HTMLDivElement>();

	const [numberToRender, setNumberToRender] = useState(5);
	const foundLimit = useRef(false);
	useMemo(() =>
	{
		foundLimit.current = false;
		setNumberToRender(5);
	}, [tournaments]);

	const tournamentsToRender = prioritizeTournaments((tournaments || []), numberToRender);
	//.filter(match => match.TournamentName.includes("OWCS"))
	//.filter(match => DateUtils.isTodayOrInFuture(new Date(match.Date)))
	//.filter(match => match.tier < 2 || match.matches.length > 0)
	//.slice(0, numberToRender);

	useEffect(() =>
	{
		if (containerRef.current && !foundLimit.current)
		{
			if (!isOverflown(containerRef.current) && tournaments.length > numberToRender)
			{
				setNumberToRender(numberToRender + 1);
			}
			else
			{
				foundLimit.current = true;
				setNumberToRender(numberToRender - 1);
			}
		}
	}, [tournaments, containerRef, numberToRender]);

	return <div className="ow col" ref={containerRef}>
		{tournamentsToRender.map(tournament =>
		{
			return <span className="group-card">
				<div className="group-card-header">
					<GameIcon tournament={tournament} />
					<div className="tournament">
						<div className="tournament-name">{tournament.name}</div>
						<div className="date-header">
							<Countdown tournament={tournament} />
						</div>
					</div>
					<TierBadge tournament={tournament} />
				</div>
				<MatchList tournament={tournament} />
			</span>;
		})}
	</div>;
};

const MatchList: FunctionComponent<{ tournament: Response.ITournament; }> = ({ tournament }) =>
{
	const matchDays = splitByDay(tournament.matches);

	return <>{matchDays.map(day =>
	{
		return <div>
			<div className="day-header">{DateUtils.getDayString(day.date)}</div>
			{day.matches.filter(m => !m.IsConcluded).map((m) =>
			{
				return <SmallPanel match={m} isActive={false} />;
			})}
		</div>;
	})}</>;
};

const SmallPanel: FunctionComponent<{ match: Response.IMatchDetails, isActive?: boolean; }> = ({ match, isActive }) =>
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

const GameIcon: FunctionComponent<{ tournament: Response.ITournament; }> = ({ tournament }) =>
{
	if (tournament.game === "overwatch")
	{
		return <img src="./Images/ow.svg" className="game-icon" />;
	}
	return <img src="./Images/sc2.png" className="game-icon" />;
};

const TierBadge: FunctionComponent<{ tournament: Response.ITournament; }> = ({ tournament }) =>
{
	return <div className={`tier-badge tier${tournament.tier}`}>{tournament.tierName}</div>;
};

const Countdown: FunctionComponent<{ tournament: Response.ITournament; }> = ({ tournament }) =>
{
	if (!tournament.dates)
	{
		return null;
	}

	const firstDay = new Date(tournament.dates.split("-")[0]);
	if (!firstDay.valueOf())
	{
		return null;
	}
	firstDay.setFullYear(new Date().getFullYear());

	if (DateUtils.isTodayOrInPast(firstDay))
	{
		return <span>Ongoing ({tournament.dates})</span>;
	}

	return <span>{DateUtils.getCountdownString(firstDay)} ({tournament.dates})</span>;
};

function prioritizeTournaments(tournaments: Response.ITournament[], renderCount: number): Response.ITournament[]
{
	const sortedTournaments = tournaments
		.slice()
		.sort(sortTournaments)
		.map(t => { return { ...t }; });

	let sortedMatches = sortedTournaments.reduce<IMatchWithTournament[]>((matches, tournament) =>
	{
		return matches.concat(tournament.matches.map(match =>
		{
			return { tournament: tournament, ...match };
		}));
	}, []);

	sortedMatches = sortedMatches
		.filter(m => !m.IsConcluded)
		.sort((a, b) => (a.tournament.tier ?? 6) - (b.tournament.tier ?? 6));

	sortedTournaments.forEach(t => t.matches = []);

	let addedCount = 0;
	let prioritizedTournaments: Response.ITournament[] = [];
	while (addedCount < renderCount && (sortedTournaments.length > 0 || sortedMatches.length > 0))
	{
		const nextTournament = sortedTournaments[0];
		let nextMatch = sortedMatches[0];

		addedCount++;
		if (nextTournament && (!nextMatch || nextTournament.tier <= nextMatch.tournament.tier))
		{
			prioritizedTournaments.push(sortedTournaments.shift());
		}
		else if (nextMatch)
		{
			nextMatch = sortedMatches.shift();
			nextMatch.tournament.matches.push(nextMatch);
		}
	}

	return prioritizedTournaments;
}

function sortTournaments(a: Response.ITournament, b: Response.ITournament): number
{
	if (a.tier === b.tier)
	{
		return getStartDate(a)?.valueOf() - getStartDate(b)?.valueOf();
	}
	return (a.tier ?? 6) - (b.tier ?? 6);
}

function getStartDate(tournament: Response.ITournament): Date | null
{
	if (!tournament.dates)
	{
		return null;
	}

	const startDate = new Date(tournament.dates.split("-")[0]);
	if (!startDate.valueOf())
	{
		return null;
	}
	startDate.setFullYear(new Date().getFullYear());
	return startDate;
}

interface IMatchWithTournament extends Response.IMatchDetails
{
	tournament: Response.ITournament;
}

function getImage(comp: Response.CompetitorDetails): string
{
	if (comp.Race)
	{
		return `./Images/${comp.Race}.png`;
	}

	return window.location.href + comp.ImageURL;
}

function splitByDay(matches: Response.IMatchDetails[]): MatchDay[]
{
	const days: MatchDay[] = [];
	matches = matches.slice();
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

function isOverflown(element: HTMLElement)
{
	return element.scrollHeight > element.clientHeight;
}