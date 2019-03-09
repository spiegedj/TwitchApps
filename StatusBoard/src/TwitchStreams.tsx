/// <reference path="../@types/data.d.ts"/>

import * as React from "react";

type twitchProps = {
    streams: Response.TwitchStream[]
};

interface IGameGroup extends IGroup<Response.TwitchStream>
{
    name: string;
}

export class TwitchStreams extends React.Component<twitchProps>
{
    public render(): React.ReactNode 
    {
        const streams = this.props.streams;
        const groupedStreams = new IGroupedList<IGameGroup, Response.TwitchStream>();
        groupedStreams.createGroup = item => { return { name: item.Game, items: [] } };
        groupedStreams.isGrouped = (a, b) => a.Game === b.Game;
        groupedStreams.populate(streams);

        const games = groupedStreams.getGroups(14);

        const tiles = games.map((game) =>
        {
            return <div className="list-group card">
                <div className="list-group-name">{game.name}</div>
                {game.items.map(stream =>
                {
                    return <div className="tile">
                        <img className="tile-image" src={stream.ImageURL}></img>
                        <div className="tile-title">{stream.Streamer}</div>
                        <div className="tile-details">{stream.Status}</div>
                        <div className="tile-viewers">{this.__addCommas(stream.Viewers)}</div>
                    </div>
                })}
            </div>
        });
        return <div className="streams list-container">{tiles}</div>
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

interface IGroup<Item>
{
    items: Item[];
}

class IGroupedList<Group extends IGroup<Item>, Item>
{
    private items: Item[];

    public createGroup: (item: Item) => Group;
    public isGrouped: (a: Item, b: Item) => boolean;

    public populate(items: Item[])
    {
        this.items = items;
    }

    public getGroups(count: number): Group[]
    {
        const groups: Group[] = [];
        let items = this.items.slice(0, count);
        while (items.length > 0)
        {
            const item = items.shift();
            const group = this.createGroup(item);
            group.items = [item];
            for (var i = 0; i < items.length; i++)
            {
                const iItem = items[i];
                if (this.isGrouped(item, iItem))
                {
                    items.splice(i, 1);
                    group.items.push(iItem);
                    i--;
                }
            }
            groups.push(group);
        }

        return groups;
    }
}