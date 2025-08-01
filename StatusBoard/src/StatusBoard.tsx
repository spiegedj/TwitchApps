/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { NowConditionsColumn, HourlyForecastColumn, WeatherPanel } from "./Weather";
import { StarCraftMatches } from "./StarCraftMatches";
import { TwitchStreams } from "./TwitchStreams";
import { EsportTournaments } from "./Liquipedia";
import { GDQEvents } from "./GDQEvents";
import { DateUtils } from "./DateUtils";
import { MetacriticColumn } from "./Metacritic";

let sessionId: number | null = null;

export class StatusBoard extends React.Component 
{
	public state: {
		data: Response.Data,
		owColumns: number,
		scColumns: number,
		gdqColumns: number,
	};

	constructor(props: any)
	{
		super(props);

		setInterval(() => this.load(), 10 * 1000);
		this.load();

		this.state = {
			data: { SessionId: null },
			gdqColumns: 0,
			owColumns: 0,
			scColumns: 0,
		};
	}

	protected get(url: string): Promise<any>
	{
		return new Promise(resolve =>
		{
			$.get(url, result => resolve(result));
		});
	}

	public async load(): Promise<void>
	{
		const data = await this.get(window.location.href + "StatusBoard") as Response.Data;

		if (typeof data.SessionId === "number" && typeof sessionId === "number" && data.SessionId !== sessionId)
		{
			location.reload();
			return;
		}
		sessionId = data.SessionId;

		this.setState({ data });
	}

	public render(): React.ReactNode 
	{
		const maxColumns = 5;
		let { GDQ, StarcraftGroups, Weather, Liquipedia, Metacritic } = this.state.data;
		let TwitchStreamsResponse = this.state.data.TwitchStreams;
		let { owColumns, scColumns, gdqColumns } = this.state;

		let twitchColumns = maxColumns - (owColumns + scColumns + gdqColumns + 1);
		if (twitchColumns < 2 && scColumns > 1)
		{
			scColumns--;
			twitchColumns++;
		}

		if (twitchColumns < 2 && owColumns > 1)
		{
			owColumns--;
			twitchColumns++;
		}

		let centerPanel = <StarCraftMatches
			groups={StarcraftGroups?.data ?? []}
			columns={scColumns}
			adjustColumns={cols => (this.state.scColumns != cols) && this.setState({ scColumns: cols })}
		/>;

		if (GDQ?.data && GDQ.data.length > 0 && DateUtils.getDaysFrom(new Date(GDQ.data[0].Date)) < 3)
		{
			centerPanel = <GDQEvents runs={GDQ.data} />;
			if (gdqColumns !== 1)
			{
				this.setState({ gdqColumns: 1 });
			}
		}
		else if (gdqColumns > 0)
		{
			this.setState({ gdqColumns: 0 });
		}

		return (
			<React.Fragment>
				<div className="calendar">
					<WeatherPanel Weather={Weather?.data} hash={Weather?.hash} />
					<div className="columns">
						<HourlyForecastColumn Weather={Weather?.data} hash={Weather?.hash} />
						<MetacriticColumn data={Metacritic?.data} />
						<EsportTournaments
							data={Liquipedia}
							columns={owColumns}
							adjustColumns={cols => cols !== this.state.owColumns && this.setState({ owColumns: cols })}
						/>
						{centerPanel}
						{/* <SteamFriendList friends={SteamFriends?.data ?? []} /> */}
						<TwitchStreams
							streams={TwitchStreamsResponse?.data ?? []}
							hash={TwitchStreamsResponse?.hash ?? 0}
							columns={twitchColumns}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}