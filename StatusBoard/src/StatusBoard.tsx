/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { NowConditionsColumn, HourlyForecastColumn, WeatherPanel } from "./Weather";
import { StarCraftMatches } from "./StarCraftMatches";
import { TwitchStreams } from "./TwitchStreams";
import { EsportTournaments } from "./Liquipedia";
import { GDQEvents } from "./GDQEvents";
import { DateUtils } from "./DateUtils";
import { SteamFriendList } from "./SteamFriendList";

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
			data: {
				Starcraft: { WCS: [], GSL: [] },
				Liquipedia: { tournaments: [], hash: 0 },
				GDQ: [],
				Weather: { Condition: {} as any, Forecast: [], Hourly: [] },
				StarcraftGroups: [],
				TwitchStreams: [],
				Headlines: [],
				SteamFriends: [],
				SessionId: null,
			},
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
		let { GDQ, StarcraftGroups, Weather, Liquipedia, SteamFriends } = this.state.data;
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

		StarcraftGroups = []; // TODO Remove
		let centerPanel = <StarCraftMatches
			groups={StarcraftGroups}
			columns={scColumns}
			adjustColumns={cols => (this.state.scColumns != cols) && this.setState({ scColumns: cols })}
		/>;

		if (GDQ.length > 0 && DateUtils.getDaysFrom(new Date(GDQ[0].Date)) < 3)
		{
			centerPanel = <GDQEvents runs={GDQ} />;
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
					<WeatherPanel weather={Weather} />
					<div className="columns">
						<NowConditionsColumn Weather={Weather} />
						<HourlyForecastColumn Weather={Weather} />
						<EsportTournaments
							data={Liquipedia}
							columns={owColumns}
							adjustColumns={cols => cols !== this.state.owColumns && this.setState({ owColumns: cols })}
						/>
						{centerPanel}
						<SteamFriendList friends={SteamFriends} />
						<TwitchStreams streams={this.state.data.TwitchStreams} columns={twitchColumns}></TwitchStreams>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
