/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { DateUtils } from "./DateUtils";

interface IStarCraftMatchesProps
{
    groups: Response.Group[];
    columns: number;
    adjustColumns: (cols: number) => void;
};

export class StarCraftMatches extends React.Component<IStarCraftMatchesProps>
{
    private getColumn(groups: Response.Group[]): JSX.Element
    {
        const groupElements = groups.map(group =>
        {
            const date = new Date(group.Date);
            const playerTable: JSX.Element[] = [];

            for (var i = 0; i < group.Players.length; i += 2)
            {
                const player1 = group.Players[i];
                let player2 = group.Players[i + 1];
                if (!player2) player2 = { Name: "", Race: "" };

                playerTable.push(<tr>
                    <td className={"playerLeft " + player1.Race.toLowerCase()}>
                        {player1.Name}
                        <span className="icon"></span>
                    </td>
                    <td className={"playerRight " + player2.Race.toLowerCase()}>
                        {player2.Name}
                        <span className="icon"></span>
                    </td>
                </tr>);
            }

            return <span className="group">
                <div className="groupName">{group.Name}</div>
                <div className="date">{DateUtils.getDateString(date)}</div>
                <table className="playerTable">
                    {playerTable}
                </table>
            </span>
        });

        return (
            <div className="sc2 col" >
                {groupElements}
            </div>
        );
    }

    public render(): React.ReactNode 
    {
        const totalRows = 23;
        const columns = 2;

        const columnEls: JSX.Element[] = [];
        const groups = this.props.groups.slice();

        for (var i = 0; i < columns; i++)
        {
            const columnGroup: Response.Group[] = [];
            let j = 0;
            while (groups.length > 0)
            {
                const nextGroup = groups[0];
                j += (2 + (nextGroup.Players.length / 2));
                if (j > totalRows) break;
                columnGroup.push(groups.shift());
            }

            if (columnGroup.length > 0)
            {
                columnEls.push(this.getColumn(columnGroup));
            }
        }

        this.props.adjustColumns(columnEls.length);

        return columnEls.slice(0, this.props.columns);
    }
}