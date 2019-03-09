/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { WeatherPanel } from "./Weather";
import { StarCraftMatches } from "./StarCraftMatches";
import { TwitchStreams } from "./TwitchStreams";
import { OverwatchEvents } from "./OverwatchEvents";


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
        return (
            <React.Fragment>
                <div className="calendar">
                    <WeatherPanel weather={this.state.data.Weather} />
                    <div className="columns">
                        <OverwatchEvents matches={this.state.data.Overwatch} />
                        <StarCraftMatches groups={this.state.data.StarcraftGroups} />
                    </div>
                </div>
                <TwitchStreams streams={this.state.data.TwitchStreams}></TwitchStreams>
            </React.Fragment>
        );
    }
}
