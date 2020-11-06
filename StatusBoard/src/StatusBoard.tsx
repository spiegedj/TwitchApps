/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { WeatherPanel } from "./Weather";
import { StarCraftMatches } from "./StarCraftMatches";
import { TwitchStreams } from "./TwitchStreams";
import { OverwatchEvents } from "./OverwatchEvents";
import { GDQEvents } from "./GDQEvents";
import { DateUtils } from "./DateUtils";
import { Headlines } from "./Headlines";

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
        const data = await this.get("http://192.168.1.19:3000/StatusBoard") as Response.Data;

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
        let { GDQ, StarcraftGroups, Weather, Overwatch } = this.state.data;
        let { owColumns, scColumns, gdqColumns } = this.state;


        let centerPanel = <StarCraftMatches groups={StarcraftGroups} adjustColumns={cols =>
        {
            if (scColumns != cols)
            {
                this.setState({ scColumns: cols })
            }
        }} />
        if (GDQ.length > 0 && DateUtils.getDaysFrom(new Date(GDQ[0].Date)) < 3)
        {
            centerPanel = <GDQEvents runs={GDQ} />;
        }

        const twichColumns = maxColumns - (owColumns + scColumns + gdqColumns);

        return (
            <React.Fragment>
                <div className="calendar">
                    <WeatherPanel weather={Weather} />
                    <div className="columns">
                        <OverwatchEvents matches={Overwatch} adjustColumns={cols => cols !== owColumns && this.setState({ owColumns: cols })} />
                        {centerPanel}
                        <TwitchStreams streams={this.state.data.TwitchStreams} columns={twichColumns}></TwitchStreams>
                    </div>
                </div>
                <Headlines headlines={this.state.data.Headlines} />
            </React.Fragment>
        );
    }
}
