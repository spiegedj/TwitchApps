/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { FunctionComponent, useEffect, useRef, useCallback, useState } from "react";
import { DateUtils } from "./DateUtils";

type gdqProps = Partial<{
	runs: Response.EventRun[];
}>;

export const GDQEvents: FunctionComponent<gdqProps> = (props) =>
{

	let tableRows = props.runs.map((run: Response.EventRun, index: number) =>
	{
		const runDate = new Date(run.Date);
		const isLive = run.IsLive;
		const isShort = index > 3;

		const rowClasses = ["row"];
		isLive && rowClasses.push("live");
		isShort && rowClasses.push("short");

		return (
			<div className={rowClasses.join(" ")}>
				<div className="imageCol">
					<img src={run.GameImage} className="game-image" />
				</div>
				<div className="rightAlign timeCol">
					<div>{DateUtils.getTimeString(runDate)}</div>
					<div className="lighten">{run.TimeEstimate}</div>
					{!isShort && <div className="lighten">{run.Runner}</div>}
				</div>
				<div className="runGame-cell mainCol">
					<ScrollingText text={run.Game} />
					<div className="lighten">{run.Category}</div>
					{!isShort && <div className="lighten">{run.Commentator}</div>}
				</div>
			</div>
		);
	});

	tableRows = tableRows.slice(0, 15);

	return (
		<div className="gdq col">
			{tableRows}
		</div>
	);
};

const DELAY_AFTER_SCROLL = 2 * 1000;
const DELAY_BEFORE_SCROLL = 5 * 1000;
const SPEED = 20;

export const ScrollingText: FunctionComponent<{ text: string, className?: string; }> = (props) =>
{
	const { text, className } = props;
	const textContainer = useRef<HTMLDivElement>();
	const timerHandle = useRef<number | undefined>();
	const currentX = useRef(0);
	const scrollWidth = useRef(0);
	const clientWidth = useRef(0);

	const animate = useCallback((previousTimestamp: number) =>
	{
		const timestamp = Date.now();
		const delta = (timestamp - previousTimestamp) / SPEED;
		let x = (currentX.current - delta);
		if (-x > (scrollWidth.current - clientWidth.current + 10))
		{
			currentX.current = 0;
			timerHandle.current = setTimeout(startAnimation, DELAY_AFTER_SCROLL);
			return;
		}

		setPosition(x);

		currentX.current = x;
		timerHandle.current = requestAnimationFrame(() => animate(timestamp));
	}, []);

	const startAnimation = useCallback(() =>
	{
		stopAnimation();
		timerHandle.current = setTimeout(() =>
		{
			scrollWidth.current = textContainer.current?.scrollWidth ?? 0;
			clientWidth.current = textContainer.current?.clientWidth ?? 0;

			timerHandle.current = requestAnimationFrame(() => animate(Date.now()));
		}, DELAY_BEFORE_SCROLL);
	}, []);

	const stopAnimation = useCallback(() =>
	{
		setPosition(0);
		cancelAnimationFrame(timerHandle.current);
		clearTimeout(timerHandle.current);
		timerHandle.current = undefined;
	}, []);

	const setPosition = useCallback((x: number) =>
	{
		if (textContainer.current)
		{
			textContainer.current.style.transform = `translateX(${x}px)`;
		}
	}, []);

	useEffect(() =>
	{
		const el = textContainer.current;
		if (el && (el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight))
		{
			startAnimation();
		}
		else
		{
			stopAnimation();
		}
	}, [textContainer, text]);

	return <div className={`scrolling-text ${className ?? ""}`}>
		<div ref={textContainer} className="scroll">{text}</div>
	</div>;
};