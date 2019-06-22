/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { DateUtils } from "./DateUtils";

type gdqProps = Partial<{
    runs: Response.EventRun[]
}>;

export class GDQEvents extends React.Component<gdqProps>
{
    public render(): React.ReactNode 
    {
        let tableRows = this.props.runs.map((run: Response.EventRun) =>
        {
            const runDate = new Date(run.Date);
            const endDate = new Date(run.EndDate);
            const isLive = DateUtils.isLive(runDate, endDate);
            return (
                <tr className={(isLive ? "live underline" : "underline")}>
                    <td>
                        <img src={run.GameImage} className="game-image" />
                    </td>
                    <td className="rightAlign runDate">
                        <div>{DateUtils.getTimeString(runDate)}</div>
                        <div className="lighten">{run.TimeEstimate}</div>
                    </td>
                    <td className="runGame">
                        <div>{run.Game}</div>
                        <div className="lighten">{run.Category}</div>
                    </td>
                    <td className="runner">
                        <div>{run.Runner}</div>
                        <div className="lighten">{run.Commentator}</div>
                    </td>
                </tr>
            );
        });

        tableRows = tableRows.slice(0, 15);

        return (
            <div className="gdq col">
                <table>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }
}