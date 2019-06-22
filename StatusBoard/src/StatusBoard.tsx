/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { WeatherPanel } from "./Weather";
import { StarCraftMatches } from "./StarCraftMatches";
import { TwitchStreams } from "./TwitchStreams";
import { OverwatchEvents } from "./OverwatchEvents";
import { GDQEvents } from "./GDQEvents";


export class StatusBoard extends React.Component 
{
    public state: { data: Response.Data };

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
                Weather: { Condition: {} as any, Forecast: [] },
                StarcraftGroups: [],
                TwitchStreams: []
            }
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
        const data = await this.get("http://localhost:3000/StatusBoard") as Response.Data;
        this.setState({
            data: data
        });
    }

    public render(): React.ReactNode 
    {
        let centerPanel = <StarCraftMatches groups={this.state.data.StarcraftGroups} />
        if (this.state.data.GDQ.length > 0)
        {
            centerPanel = <GDQEvents runs={this.state.data.GDQ} />;
        }

        return (
            <React.Fragment>
                <div className="calendar">
                    <WeatherPanel weather={this.state.data.Weather} />
                    <div className="columns">
                        <OverwatchEvents matches={this.state.data.Overwatch} />
                        {centerPanel}
                    </div>
                </div>
                <TwitchStreams streams={this.state.data.TwitchStreams}></TwitchStreams>
            </React.Fragment>
        );
    }
}
