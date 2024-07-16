/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { FunctionComponent, useLayoutEffect, useRef, useMemo, useState } from "react";
import { DateUtils } from "./DateUtils";
import { ICompetitorDetails, IMatchDetails, ITournament } from "./IResponseInterfaces";

interface owProps
{
	tournaments: ITournament[];
	adjustColumns: (cols: number) => void;
	columns: number;
};

interface MatchDay
{
	date: Date,
	matches: IMatchDetails[];
}

export const EsportTournaments: FunctionComponent<owProps> = (props) =>
{
	let { tournaments } = props;

	const containerRef = useRef<HTMLDivElement>();

	const [numberToRender, setNumberToRender] = useState(5);
	const foundLimit = useRef(false);
	useMemo(() =>
	{
		foundLimit.current = false;
		setNumberToRender(5);
	}, [tournaments]);

	const tournamentsToRender = prioritizeTournaments((tournaments || []), numberToRender);

	useLayoutEffect(() =>
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

const MatchList: FunctionComponent<{ tournament: ITournament; }> = ({ tournament }) =>
{
	const matchDays = splitByDay(tournament.matches);

	return <>{matchDays.map(day =>
	{
		return <div>
			<div className="day-header">{DateUtils.getDayString(day.date)}</div>
			{day.matches.map((m) =>
			{
				return <SmallPanel match={m} />;
			})}
		</div>;
	})}</>;
};

const SmallPanel: FunctionComponent<{ match: IMatchDetails; }> = ({ match }) =>
{
	const status = (match.score) ? match.score : DateUtils.getTimeString(new Date(match.date));

	const comp1ClassNames = ["comp", "comp-1"];
	const comp2ClassNames = ["comp", "comp-2"];

	const containerClassNames = ["tile"];
	if (match.isLive)
	{
		containerClassNames.push("active");
	}

	return <div className={containerClassNames.join(" ")}>
		<div className={comp1ClassNames.join(" ")}>
			<div className="comp-name">{match.competitor1.name}</div>
			<img src={getImage(match.competitor1)} className="image" />
		</div>
		<div className={comp2ClassNames.join(" ")}>
			<img src={getImage(match.competitor2)} className="image" />
			<div className="comp-name">{match.competitor2.name}</div>
		</div>
		<span className="status">{status}</span>
	</div>;
};

const GameIcon: FunctionComponent<{ tournament: ITournament; }> = ({ tournament }) =>
{
	if (tournament.game === "overwatch")
	{
		return <img src="./Images/ow.svg" className="game-icon" />;
	}
	return <img src="./Images/sc2.png" className="game-icon" />;
};

const TierBadge: FunctionComponent<{ tournament: ITournament; }> = ({ tournament }) =>
{
	return <div className={`tier-badge tier${tournament.tier}`}>{tournament.tierName}</div>;
};

const Countdown: FunctionComponent<{ tournament: ITournament; }> = ({ tournament }) =>
{
	if (!tournament.dates || !tournament.startDate)
	{
		return null;
	}

	const firstDay = new Date(tournament.startDate);
	if (!tournament.isUpcoming)
	{
		return <span>Ongoing ({tournament.dates})</span>;
	}

	return <span>{DateUtils.getCountdownString(firstDay)} ({tournament.dates})</span>;
};

function prioritizeTournaments(tournaments: ITournament[], renderCount: number): ITournament[]
{
	if (tournaments.length === 0) { return tournaments; }

	tournaments = tournaments.map(t => { return { ...t }; });

	let matches = tournaments.reduce<IMatchWithTournament[]>((matches, tournament) =>
	{
		return matches.concat(tournament.matches.map(match =>
		{
			return { tournament: tournament, ...match, tier: tournament.tier };
		}));
	}, []).filter(m => !m.isConcluded);
	tournaments.forEach(t => t.matches = []);

	let prioritizedElements = [...tournaments, ...matches]
		.sort(sortElements);

	prioritizedElements = prioritizedElements.slice(0, renderCount);

	prioritizedElements.forEach(match =>
	{
		if (isMatch(match))
		{
			match.tournament.matches.push(match);
		}
	});

	return prioritizedElements.filter(el => !isMatch(el)) as ITournament[];
}

function sortElements(a: ITournament | IMatchWithTournament, b: ITournament | IMatchWithTournament): number
{
	if (a.tier !== b.tier)
	{
		return a.tier - b.tier;
	}

	const aStartDate = getStartDate(a);
	const bStartDate = getStartDate(b);
	if (aStartDate !== bStartDate)
	{
		return aStartDate - bStartDate;
	}

	if (isTournament(a) && !isTournament(b)) 
	{
		return -1;
	}

	if (!isTournament(a) && isTournament(b)) 
	{
		return 1;
	}

	return 0;
}

function getStartDate(tournament: ITournament | IMatchWithTournament): number
{
	if (isMatch(tournament))
	{
		return tournament.date;
	}

	if (tournament.nextMatchDate !== undefined)
	{
		return tournament.nextMatchDate;
	}

	return 100000000000 + tournament.startDate;
}

function isMatch(a: Object): a is IMatchWithTournament
{
	return a.hasOwnProperty("tournament");
}

function isTournament(a: Object): a is ITournament
{
	return a.hasOwnProperty("matches");
}

interface IMatchWithTournament extends IMatchDetails
{
	tournament: ITournament;
	tier: number;
}

function getImage(comp: ICompetitorDetails): string
{
	if (comp.race)
	{
		return `./Images/${comp.race}.png`;
	}

	return window.location.href + comp.imageUrl;
}

function splitByDay(matches: IMatchDetails[]): MatchDay[]
{
	const days: MatchDay[] = [];
	matches = matches.slice();
	while (matches.length > 0)
	{
		const match = matches.shift();
		const matchDay: MatchDay = {
			date: new Date(match.date),
			matches: [match]
		};

		for (var i = 0; i < matches.length; i++)
		{
			const iMatch = matches[i];
			if (DateUtils.onSameDay(matchDay.date, new Date(iMatch.date)))
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