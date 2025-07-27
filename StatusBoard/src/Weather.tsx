/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { DateUtils } from "./DateUtils";

export const WeatherPanel: React.FunctionComponent<{ Weather: Response.Weather | undefined, hash: number; }> = React.memo((props) =>
{
	const { Weather } = props;
	if (!Weather)
	{
		return null;
	}
	const condition = Weather.Condition;
	const forecast = Weather.Forecast;

	return (
		<div className="weather-row">
			<ClockPanel />
			<div className="weather-panel" style={{ width: 200 }}>
				<div className="title">Now</div>
				<div className="current-temp">{condition.Temp}</div>
				<div className="label">{condition.FeelsLike}</div>
				<div className="icon-container">
					<div className="temp-icon" dangerouslySetInnerHTML={{ __html: condition.Icon }}></div>
					<div className="label">{condition.Phrase}</div>
				</div>
			</div>
			<div className="weather-panel forecast flex-row">
				{forecast.slice(0, 11).map(forecast =>
					<ForecastPanel key={forecast.Date} forecast={forecast} />
				)}
			</div>
		</div>
	);
}, (prevProps, nextProps) => prevProps.hash === nextProps.hash);

export const ClockPanel: React.FunctionComponent = () =>
{
	const [timeString, setTime] = useState("");

	useEffect(() =>
	{
		const timeoutId = setInterval(() =>
		{
			const time = DateUtils.getTimeString(new Date());
			setTime(time);
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, []);

	const { time, ampm } = splitTime(timeString);
	return (
		<div className="clock">
			<div>
				<div className="clock-time">
					{time}
					<span className="ampm">{ampm}</span>
				</div>
			</div>
		</div>
	);
};

export const DatePanel: React.FunctionComponent = () =>
{
	const [date, setDate] = useState("");
	const updateDate = useCallback(() =>
	{
		const date = new Date().toLocaleDateString("en-us",
			{ weekday: "long", month: "long", day: "numeric", year: "numeric" }
		);
		setDate(date);
	}, []);

	useEffect(() =>
	{
		updateDate();
		const timeoutId = setInterval(() => updateDate(), 60 * 1000);

		return () => clearTimeout(timeoutId);
	}, []);

	return <div className="weather-panel">
		<div className="clock-date">{date}</div>
	</div>;
};

export const NowConditionsColumn: React.FunctionComponent<{ Weather: Response.Weather | undefined; }> = (props) =>
{
	const { Weather } = props;
	if (!Weather)
	{
		return null;
	}
	const { Condition } = Weather;

	const sunrise = splitTime(Condition?.Sunrise);
	const sunset = splitTime(Condition?.Sunset);

	return <div className="weather-column">
		<DatePanel />
		<div className="weather-panel">
			<div className="title">Sunrise & sunset</div>
			<div>
				<span className="data">{sunrise.time}</span>
				<span className="ampm">{sunrise.ampm}</span>
			</div>
			<div className="label">Sunrise</div>
			<div>
				<span className="data">{sunset.time}</span>
				<span className="ampm">{sunset.ampm}</span>
			</div>
			<div className="label">Sunset</div>
		</div>
		{Condition.Details?.map(item => <WeatherItem key={item.label} item={item} />)}
	</div>;
};

export const HourlyForecastColumn: React.FunctionComponent<{ Weather: Response.Weather | undefined, hash: number; }> = React.memo((props) =>
{
	const { Weather } = props;
	if (!Weather)
	{
		return null;
	}
	const { Hourly } = Weather;

	return <div className="weather-column">
		<DatePanel />
		<div className="weather-panel hourly">
			<div className="title">Hourly Forecast</div>
			{Hourly.slice(0, 21).map(hourly => <HourlyPanel key={hourly.Day + hourly.Hour} hourly={hourly} />)}
		</div>
	</div>;
}, (prevProps, nextProps) => prevProps.hash === nextProps.hash);

const WeatherItem: React.FunctionComponent<{ item: Response.ItemDetails; }> = ({ item }) =>
{
	const { label, dataIcon, data, labelIcon } = item;
	return <div className="weather-panel flex-row">
		<div className="label-icon" dangerouslySetInnerHTML={{ __html: labelIcon }}></div>
		<div>
			<span className="title">{label}</span>
			<div className="flex-row">
				{dataIcon && <span className="data-icon" dangerouslySetInnerHTML={{ __html: dataIcon }}></span>}
				<span>{data}</span>
			</div>
		</div>
	</div>;
};

const HourlyPanel: React.FunctionComponent<{ hourly: Response.Hourly; }> = ({ hourly }) =>
{
	const precipitationStr = hourly.Precipitation;
	const showPreciptation = parseInt(precipitationStr) > 5;

	const hour = parseInt(hourly.Hour);
	const addBorder = (hour % 12) === 0;

	return <div className={"forecast-list-item" + (addBorder ? " divider-bottom " : "")}>
		<span className="title">{hourly.Hour}</span>
		<span className="flex-row">
			{showPreciptation && <span className="precip">{hourly.Precipitation}</span>}
			<div className="temp-icon" dangerouslySetInnerHTML={{ __html: hourly.Icon }}></div>
		</span>
		<div className="temp">{hourly.Temp}</div>
	</div>;
};

const ForecastPanel: React.FunctionComponent<{ forecast: Response.Forecast; }> = ({ forecast }) =>
{
	return <>
		<div className="forecast-list-item">
			<div className="label">{forecast.Date}</div>
			<div className="temp-icon" dangerouslySetInnerHTML={{ __html: forecast.Icon }}></div>
			<div>
				<span className="temp">
					<span>{forecast.High}</span>
					<span className="slash"></span>
					<span>{forecast.Low}</span>
				</span>
			</div>
		</div>
	</>;
};

export const Precipitation: React.FunctionComponent<{ precipitation: string; }> = ({ precipitation }) =>
{
	return <div className="precip">
		<svg className="icon-drop" viewBox="0 0 200 200" transform="scale(4) translate(3, -3)">
			<use className="svg-drop" href="#svg-symbol-drop"></use>
		</svg>
		<span>{precipitation}</span>
	</div>;
};

export const splitTime = (time: string | undefined): { time: string, ampm: string; } =>
{
	if (!time)
	{
		return { time: "", ampm: "" };
	}

	time = time.toLowerCase();
	const isAM = time.indexOf("am") > 0;
	const index = isAM ? time.indexOf("am") : time.indexOf("pm");
	return {
		time: time.slice(0, index).trim(),
		ampm: isAM ? "AM" : "PM"
	};
};