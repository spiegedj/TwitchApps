import { useState, useEffect } from "react";
import * as React from "react";
import { ScrollingText } from "./GDQEvents";

interface IMetacriticColumnProps
{
	data: Response.Metacritic | undefined;
}

const ShuffleInterval = 10 * 1000;

export const MetacriticColumn = (props: IMetacriticColumnProps) => 
{
	const [currentIndex, setCurrentIndex] = useState(0);
	useEffect(() =>
	{
		const intervalId = setInterval(() =>
		{
			setCurrentIndex((prevIndex) => (prevIndex + 1) % (props.data?.Components.length || 1));
		}, ShuffleInterval);

		return () => clearInterval(intervalId);
	}, [props.data?.Components.length]);

	if (!props.data || !props.data.Components || props.data.Components.length === 0)
	{
		return null;
	}

	const component = props.data.Components[currentIndex];

	return <MetacriticComponent component={component} />;
};

const MetacriticComponent = (props: { component: Response.MetacriticComponent; }) =>
{
	const { component } = props;
	const items = component?.Items ?? [];
	if (items.length === 0)
	{
		return null;
	}
	return <div className="metacritic-column">
		<div className="title-card">{component.Title}</div>
		{items.map((entry) =>
		{
			return <div key={entry.Title} className="card">
				<img crossOrigin="anonymous" src={entry.ImageSrc}></img>
				<div className="alt-line1">
					<ScrollingText text={entry.Title} />
				</div>
				<div className="metascore">{entry.Score}</div>
				<Metascore score={entry.Score} />
			</div>;
		})}
	</div>;
};

const Metascore = ({ score }: { score: string; }) =>
{
	return <span className={["metascore", getMetacriticScoreColor(score)].join(" ")}>
		{score}
	</span>;
};

const getMetacriticScoreColor = (score: string): string =>
{
	let scoreNum = parseInt(score, 10);
	if (scoreNum >= 60)
	{
		return "green";
	}
	else if (scoreNum >= 40)
	{
		return "yellow";
	}
	return "red";
};
