/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { WeatherPanel } from "./Weather";
import { StarCraftMatches } from "./StarCraftMatches";
import { TwitchStreams } from "./TwitchStreams";
import { OverwatchEvents } from "./OverwatchEvents";
import { GDQEvents } from "./GDQEvents";
import { DateUtils } from "./DateUtils";
import { Headlines } from "./Headlines";
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

        setInterval(() => this.load(), 60 * 1000);
        this.load();

        this.state = {
            data: {
                Starcraft: { WCS: [], GSL: [] },
                Overwatch: [],
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
        const data = await this.get(window.location.href + ":3000/StatusBoard") as Response.Data;

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
        let { GDQ, StarcraftGroups, Weather, Overwatch, SteamFriends } = this.state.data;
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
            groups={StarcraftGroups}
            columns={scColumns}
            adjustColumns={cols => (this.state.scColumns != cols) && this.setState({ scColumns: cols })}
        />

        if (GDQ.length > 0 && DateUtils.getDaysFrom(new Date(GDQ[0].Date)) < 3)
        {
            centerPanel = <GDQEvents runs={GDQ} />;
            gdqColumns = 2;
        }

        return (
            <React.Fragment>
                <div className="calendar">
                    <WeatherPanel weather={Weather} />
                    <div className="columns">
                        <SteamFriendList friends={SteamFriends} />
                        <OverwatchEvents
                            matches={Overwatch}
                            columns={owColumns}
                            adjustColumns={cols => cols !== this.state.owColumns && this.setState({ owColumns: cols })}
                        />
                        {centerPanel}
                        <TwitchStreams streams={this.state.data.TwitchStreams} columns={twitchColumns}></TwitchStreams>
                    </div>
                </div>
                <Headlines headlines={this.state.data.Headlines} />
            </React.Fragment>
        );
    }
}
