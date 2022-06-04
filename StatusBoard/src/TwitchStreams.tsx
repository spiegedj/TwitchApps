/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { addCommas } from "./Utils";
import { IGroupedList, IGroup } from "./GroupedList";

interface TwitchProps
{
    streams: Response.TwitchStream[];
    columns: number;
};

const MIN_TILE_WIDTH = 280;
const MIN_TILE_HEIGHT_L = 80;
const MIN_TILE_HEIGHT_S = 48;

interface IGameGroup extends IGroup<Response.TwitchStream>
{
    name: string;
}
const createGroup = (item: Response.TwitchStream) =>
{
    return { name: item.Game, items: [], key: item.Game }
}
const isGrouped = (a: Response.TwitchStream, b: Response.TwitchStream) =>
{
    return a.Game === b.Game;
}
const getSize = (groups: IGameGroup[]) =>
{
    var items = groups.reduce((items, group) => items.concat(...group.items), [] as Response.TwitchStream[]);
    return (items.length * (MIN_TILE_HEIGHT_S + 6)) + (groups.length * 32);
}

export const TwitchStreams = (props: TwitchProps) =>
{
    const { streams } = props;

    const containerRef = useRef<HTMLDivElement>();
    const [containerWidth, setContainerWidth] = useState(1520);
    const [containerHeight, setContainerHeight] = useState(1520);

    const remeasure = () =>
    {
        if (containerRef.current)
        {
            setContainerWidth(containerRef.current.offsetWidth);
            setContainerHeight(containerRef.current.offsetHeight);
        }
    }

    useEffect(() =>
    {
        const timerId = window.setInterval(remeasure, 300);
        return () =>
        {
            window.clearInterval(timerId);
        }
    });

    const rows: JSX.Element[] = [];

    let currentRow: JSX.Element[] = [];
    let currentHeight = 0;
    let currentWidth = MIN_TILE_WIDTH;

    const followedStreams = streams.filter(s => s.Followed);
    for (let stream of followedStreams)
    {
        const tileHeight = MIN_TILE_HEIGHT_L + 4;
        const tileWidth = MIN_TILE_WIDTH + 10;

        if ((currentHeight + tileHeight) >= (containerHeight + 1))
        {
            rows.push(<StreamColumn children={currentRow} />);
            currentRow = [];
            currentHeight = 0;
            currentWidth += tileWidth;

            if (currentWidth > (containerWidth + 1))
            {
                break;
            }
        }

        currentHeight += tileHeight;
        currentRow.push(<StreamCard stream={stream} tileHeight={tileHeight} />);
    }

    let remainingStreams = streams.filter(s => !s.Followed);
    const groupedStreams = new IGroupedList<IGameGroup, Response.TwitchStream>();
    groupedStreams.createGroup = createGroup;
    groupedStreams.isGrouped = isGrouped;
    groupedStreams.getSize = getSize;
    while (currentWidth < (containerWidth + 1)) 
    {
        groupedStreams.populate(remainingStreams);
        const remainingHeight = containerHeight - currentHeight;
        const grouped = groupedStreams.getGroups(remainingHeight);
        const tileWidth = MIN_TILE_WIDTH + 10;

        const tiles = grouped.groups.map((game) =>
        {
            return <div className="group-card">
                <div className="list-group-name">{game.name}</div>
                {game.items.map(stream =>
                {
                    return <SmallStreamCard stream={stream} tileHeight={MIN_TILE_HEIGHT_S} />
                })}
            </div>
        });
        currentRow = currentRow.concat(tiles);

        rows.push(<StreamColumn children={currentRow} />);
        currentRow = [];
        currentHeight = 0;
        currentWidth += tileWidth;
        remainingStreams = grouped.remainingItems;
    }


    if (currentRow.length > 0)
    {
        rows.push(<StreamColumn children={currentRow} />);
    }

    return <div className="twitchStreams" ref={containerRef}>{rows}</div>;
}

interface StreamCardProps
{
    stream: Response.TwitchStream;
    tileHeight: number;
}

const StreamColumn = ({ children }: { children: JSX.Element[] }) => 
{
    return <div className="group" style={{ minWidth: MIN_TILE_WIDTH }}>{children}</div>;
}

export const StreamCard = ({ stream, tileHeight }: StreamCardProps) =>
{
    return <div className="tile group-card" style={{ minHeight: tileHeight }}>
        <img className="tile-image" crossOrigin="anonymous" src={stream.ImageURL}></img>
        <div>
            <div className="tile-title">{stream.Streamer}</div>
            <div className="tile-game">{stream.Game}</div>
            <div className="tile-details">{stream.Status}</div>
        </div>
        <div className="tile-viewers">
            <span className="live-indicator"></span>
            <span>{addCommas(stream.Viewers)}</span>
        </div>
    </div>
}

export const SmallStreamCard = ({ stream, tileHeight }: StreamCardProps) =>
{
    return <div className="tile small" style={{ minHeight: tileHeight }}>
        <img className="tile-image" crossOrigin="anonymous" src={stream.ImageURL} style={{ width: tileHeight }}></img>
        <div className="tile-title">{stream.Streamer}</div>
        <div className="tile-details">{stream.Status}</div>
        <div className="tile-viewers">
            <span className="live-indicator"></span>
            <span>{addCommas(stream.Viewers)}</span>
        </div>
    </div>
}