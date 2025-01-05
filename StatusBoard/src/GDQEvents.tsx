/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { DateUtils } from "./DateUtils";

type gdqProps = Partial<{
	runs: Response.EventRun[];
}>;

export class GDQEvents extends React.Component<gdqProps>
{
	public render(): React.ReactNode 
	{
		let tableRows = this.props.runs.map((run: Response.EventRun, index: number) =>
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
						<div className="runGame">{run.Game}</div>
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
	}
}