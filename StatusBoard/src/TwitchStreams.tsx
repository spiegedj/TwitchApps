/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { addCommas } from "./Utils";
import { IGroupedList, IGroup } from "./GroupedList";
import { ScrollingText } from "./GDQEvents";
import { render } from "react-dom";

interface TwitchProps
{
	streams: Response.TwitchStream[];
	columns: number;
};

const MIN_TILE_WIDTH = 280;
const MIN_TILE_HEIGHT_L = 84;
const MIN_TILE_HEIGHT_S = 48;


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
	};

	useEffect(() =>
	{
		const timerId = window.setInterval(remeasure, 300);
		return () =>
		{
			window.clearInterval(timerId);
		};
	}, []);


	let curCol = 0;
	let curRow = -1;

	let children: JSX.Element[] = [];
	let currentHeight = 0;
	let currentWidth = MIN_TILE_WIDTH;

	// const [a, setIsSmall] = useState(false);
	// useEffect(() =>
	// {
	// 	const timerId = window.setInterval(() =>
	// 	{
	// 		setIsSmall(!a);
	// 	}, 2000);
	// 	return () =>
	// 	{
	// 		window.clearInterval(timerId);
	// 	};
	// });

	const tileWidth = containerWidth / Math.floor(containerWidth / MIN_TILE_WIDTH);
	const tileHeight = containerHeight / Math.floor(containerHeight / MIN_TILE_HEIGHT_L);

	const followedStreams = streams.filter(s => s.Followed);

	const newMap: { key: string, el: JSX.Element; }[] = [];
	for (let stream of followedStreams)
	{
		if ((currentHeight + tileHeight) >= (containerHeight + 1))
		{
			curCol++;
			currentHeight = 0;
			currentWidth += tileWidth;
			curRow = -1;

			if (currentWidth > (containerWidth + 1))
			{
				break;
			}
		}

		curRow++;
		currentHeight += tileHeight;

		const x = curCol * tileWidth;
		const y = curRow * tileHeight;
		children.push(<StreamCard stream={stream} height={tileHeight} x={x} y={y} width={tileWidth} key={stream.Streamer} />);

		newMap.push({ key: stream.Streamer, el: <StreamCard stream={stream} height={tileHeight} x={x} y={y} width={tileWidth} key={stream.Streamer} /> });
	}

	const renderedOrder = useRef(new Map<string, number>());
	newMap.sort((a, b) =>
	{
		const aIdx = renderedOrder.current.get(a.key) ?? 100000;
		const bIdx = renderedOrder.current.get(b.key) ?? 100000;
		return aIdx - bIdx;
	});
	renderedOrder.current = newMap.reduce((acc, el, idx) => acc.set(el.key, idx), new Map<string, number>());

	return <div className="twitchStreams" ref={containerRef}>
		{newMap.map(x => x.el)}
	</div>;
};

interface StreamCardProps
{
	stream: Response.TwitchStream;
	x: number;
	y: number;
	width: number;
	height: number;
}

const StreamColumn = ({ children }: { children: JSX.Element[]; }) => 
{
	return <div className="group" style={{ minWidth: MIN_TILE_WIDTH }}>{children}</div>;
};

export const StreamCard = ({ stream, x, y, width, height }: StreamCardProps) =>
{
	const horMargin = 5;
	const vertMargin = 6;
	width -= horMargin;
	height -= vertMargin;

	return <div
		className="tile group-card tag-style"
		style={{ top: y, left: x, width, height, margin: `${vertMargin}px ${horMargin}px` }}
	>
		<img className="tile-image" crossOrigin="anonymous" src={stream.ImageURL}></img>
		<div>
			<div className="tile-title">{stream.Streamer}</div>
			<div className="tile-game">
				<ScrollingText text={stream.Game} />
			</div>
			<div className="tile-details">
				<ScrollingText text={stream.Status} />
			</div>
		</div>
		<div className="tile-viewers">
			<span className="live-indicator"></span>
			<span>{addCommas(stream.Viewers)}</span>
		</div>
	</div>;
};

export const SmallStreamCard = ({ stream, height }: StreamCardProps) =>
{
	return <div className="tile small" style={{ minHeight: height }}>
		<img className="tile-image" crossOrigin="anonymous" src={stream.ImageURL} style={{ width: height }}></img>
		<div className="tile-title">{stream.Streamer}</div>
		<div className="tile-details">{stream.Status}</div>
		<div className="tile-viewers">
			<span className="live-indicator"></span>
			<span>{addCommas(stream.Viewers)}</span>
		</div>
	</div>;
};