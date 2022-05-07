/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { addCommas } from "./Utils";

interface TwitchProps
{
    streams: Response.TwitchStream[];
    columns: number;
};

const MIN_TILE_WIDTH = 280;
const MIN_TILE_HEIGHT_L = 80;
const MIN_TILE_HEIGHT_S = 60;

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

    for (let stream of streams)
    {
        const shouldEmphasize = stream.Followed;
        const tileHeight = shouldEmphasize ? MIN_TILE_HEIGHT_L : MIN_TILE_HEIGHT_S;
        const tileWidth = MIN_TILE_WIDTH + 10;

        if ((currentHeight + tileHeight) >= (containerHeight + 1))
        {
            rows.push(<div className="group" style={{ minWidth: MIN_TILE_WIDTH }}>{currentRow}</div>);
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

    if (currentRow.length > 0)
    {
        rows.push(<div className="group" style={{ minWidth: MIN_TILE_WIDTH }}>{currentRow}</div>);
    }

    return <div className="twitchStreams" ref={containerRef}>{rows}</div>;
}

interface StreamCardProps
{
    stream: Response.TwitchStream;
    tileHeight: number;
}

export const StreamCard = ({ stream, tileHeight }: StreamCardProps) =>
{
    return <div className="tile card" style={{ minHeight: tileHeight }}>
        <img className="tile-image" crossOrigin="anonymous" src={stream.ImageURL}></img>
        <div className="tile-title">{stream.Streamer}</div>
        <div className="tile-game">{stream.Game}</div>
        <div className="tile-details">{stream.Status}</div>
        <div className="tile-viewers">
            <span className="live-indicator"></span>
            <span>{addCommas(stream.Viewers)}</span>
        </div>
    </div>
}