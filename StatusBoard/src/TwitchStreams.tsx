/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { IGroupedList, IGroup } from "./GroupedList";

interface TwitchProps
{
    streams: Response.TwitchStream[];
    columns: number;
};

interface IGameGroup extends IGroup<Response.TwitchStream>
{
    name: string;
}

export class TwitchStreams extends React.Component<TwitchProps>
{
    private createGroup = (item: Response.TwitchStream) =>
    {
        return { name: item.Game, items: [], key: item.Game }
    }

    private isGrouped = (a: Response.TwitchStream, b: Response.TwitchStream) =>
    {
        return a.Game === b.Game;
    }

    private getSize = (groups: IGameGroup[]) =>
    {
        var items = groups.reduce((items, group) => items.concat(...group.items), [] as Response.TwitchStream[]);
        return items.length * 53 + groups.length * 50;
    }

    public render(): React.ReactNode 
    {
        const groupedStreams = new IGroupedList<IGameGroup, Response.TwitchStream>();
        groupedStreams.createGroup = this.createGroup;
        groupedStreams.isGrouped = this.isGrouped;
        groupedStreams.getSize = this.getSize;


        const colCount = this.props.columns;

        const columns: JSX.Element[] = [];
        let remainingItems = this.props.streams;
        for (let i = 0; (i < colCount && remainingItems.length > 0); i++)
        {
            groupedStreams.populate(remainingItems);
            const groupResponse = groupedStreams.getGroups(800);
            remainingItems = groupResponse.remainingItems;

            const tiles = groupResponse.groups.map((game) =>
            {
                return <div className="list-group card">
                    <div className="list-group-name">{game.name}</div>
                    {game.items.map(stream =>
                    {
                        return <div className="tile">
                            <img className="tile-image" crossOrigin="anonymous" src={stream.ImageURL}></img>
                            <div className="tile-title">{stream.Streamer}</div>
                            <div className="tile-details">{stream.Status}</div>
                            <div className="tile-viewers">{this.__addCommas(stream.Viewers)}</div>
                        </div>
                    })}
                </div>
            });
            columns.push(<div className="streams list-container">{tiles}</div>);
        }
        return columns.reverse();
    }

    private __addCommas(num: number)
    {
        var numString = num.toString();
        var commaString = "";

        for (var i = numString.length; i > 3; i -= 3)
        {
            commaString = "," + numString.substr(Math.max(0, i - 3), i) + commaString;
        }
        commaString = numString.substr(0, i) + commaString;
        return commaString;
    }
}