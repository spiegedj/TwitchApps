/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { DateUtils } from "./DateUtils";

type scProps = Partial<{
    tournaments: Response.Tournament[]
}>;

export abstract class StarCraftEvents extends React.Component<scProps>
{
    protected getClasses(): string { return "eventTile"; }

    public render(): React.ReactNode 
    {
        const events = this.props.tournaments.map((tournament: Response.Tournament) =>
        {
            const tournamentRow = <tr><td colSpan={2} className="tournament-name" >{tournament.Name}</td></tr>;
            const events = tournament.Days.map(event =>
            {
                const dateString = event.IsLive ? "Live Now" : DateUtils.getDateString(new Date(event.Date));
                return (
                    <tr className={event.IsLive ? "live" : ""}>
                        <td>{event.Stage}</td>
                        <td>{dateString}</td>
                    </tr>);
            });

            return [tournamentRow, ...events];
        })

        return (
            <div className={this.getClasses()}>
                <table>
                    <tbody>
                        {events}
                    </tbody>
                </table>
            </div>
        );
    }
}

class WCSEvents extends StarCraftEvents 
{
    protected getClasses(): string
    {
        return super.getClasses() + " wcs";
    }
}

class GSLEvents extends StarCraftEvents 
{
    protected getClasses(): string
    {
        return super.getClasses() + " gsl";
    }
}