/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { useEffect, useState, useRef } from "react";
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

let canvas: HTMLCanvasElement | null = null;
function getTextWidth(text, font)
{
    // re-use canvas object for better performance
    canvas = canvas || document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return Math.ceil(metrics.width);
}

const MAX_WIDTH = 300;
function getStreamWidth(stream: Response.TwitchStream): number
{
    return 250;

    const titleWidth = getTextWidth(stream.Streamer, "17pt Industry");
    const gameWidth = getTextWidth(stream.Game, "12pt Industry");
    const statusWidth = (getTextWidth(stream.Status, "9pt Industry") / 2);

    return Math.min(Math.max(titleWidth, statusWidth, gameWidth) + 82 + 5 + 2, MAX_WIDTH);
}

function addCommas(num: number): string
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

export const TwitchStreams = (props: TwitchProps) =>
{
    const { streams } = props;

    const containerRef = useRef<HTMLDivElement>();
    const [totalWidth, setTotalWidth] = useState(1520);
    const remeasure = () =>
    {
        if (containerRef.current)
        {
            setTotalWidth(containerRef.current.clientWidth);
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
    let currentWidth = 0;
    for (let stream of streams)
    {
        const baseWidth = getStreamWidth(stream);
        const width = baseWidth + 10;

        if ((currentWidth + width) > totalWidth)
        {
            rows.push(<div className="horizontal-list">{currentRow}</div>);
            currentRow = [];
            currentWidth = 0;
        }
        currentWidth += width;

        currentRow.push(<div className="tile card" style={{ flexBasis: baseWidth }}>
            <img className="tile-image" crossOrigin="anonymous" src={stream.ImageURL}></img>
            <div className="tile-title">{stream.Streamer}</div>
            <div className="tile-game">{stream.Game}</div>
            <div className="tile-details">{stream.Status}</div>
            <div className="tile-viewers">
                <span className="live-indicator"></span>
                <span>{addCommas(stream.Viewers)}</span>
            </div>
        </div>);
    }
    rows.push(<div className="horizontal-list">{currentRow}</div>);

    return <div className="horizontal-lists" ref={containerRef}>{rows}</div>;
}