/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { addCommas } from "./Utils";
import { ScrollingText } from "./GDQEvents";

interface TwitchProps
{
	streams: Response.TwitchStream[];
	columns: number;
};

const MIN_TILE_WIDTH = 280;
const MIN_TILE_HEIGHT_L = 86;
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

	let currentHeight = 0;
	let currentWidth = MIN_TILE_WIDTH;

	const tileWidth = containerWidth / Math.floor(containerWidth / MIN_TILE_WIDTH);
	let tileHeight: number;

	const followedStreams = streams;

	const newMap: { key: string, el: JSX.Element; }[] = [];
	for (let stream of followedStreams)
	{
		tileHeight = getTileHeight(containerHeight, currentHeight, stream.Followed);

		if (tileHeight === 0)
		{
			curCol++;
			currentHeight = 0;
			currentWidth += tileWidth;
			tileHeight = getTileHeight(containerHeight, currentHeight, stream.Followed);

			if (currentWidth > (containerWidth + 1))
			{
				break;
			}
		}

		const x = curCol * tileWidth;
		const y = currentHeight;

		currentHeight += tileHeight;

		const card = stream.Followed
			? <StreamCard stream={stream} height={tileHeight} x={x} y={y} width={tileWidth} key={stream.Streamer} />
			: <SmallStreamCard stream={stream} height={tileHeight} x={x} y={y} width={tileWidth} key={stream.Streamer} />;

		newMap.push({ key: stream.Streamer, el: card });
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

function getTileHeight(containerHeight: number, currentHeight: number, isFollowed: boolean): number
{
	const minTileHeight = isFollowed ? MIN_TILE_HEIGHT_L : MIN_TILE_HEIGHT_S;
	const remainingHeight = containerHeight - currentHeight;
	if (remainingHeight <= 0) { return 0; }
	return remainingHeight / Math.floor(remainingHeight / minTileHeight);
}

interface StreamCardProps
{
	stream: Response.TwitchStream;
	x: number;
	y: number;
	width: number;
	height: number;
}

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

export const SmallStreamCard = ({ stream, x, y, width, height }: StreamCardProps) =>
{
	const horMargin = 5;
	const vertMargin = 6;
	width -= horMargin;
	height -= vertMargin;

	return <div
		className="tile small group-card tag-style"
		style={{ top: y, left: x, width, height, margin: `${vertMargin}px ${horMargin}px` }}
	>
		<img className="tile-image" crossOrigin="anonymous" src={stream.ImageURL} style={{ width: height }}></img>
		<div>
			<div className="tile-title">{stream.Streamer}</div>
			<div className="tile-details">
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