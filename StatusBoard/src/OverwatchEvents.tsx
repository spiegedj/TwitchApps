/// <reference path="../@types/data.d.ts"/>

import * as React from "react";
import { DateHeader } from "./DateHeader";
import { DateUtils } from "./DateUtils";

type owProps = Partial<{
    matches: Response.MatchDetails[]
}>;

const swapColors = [
    "toronto defiant"
];

const imageOverrides = {
    "philadelphia fusion": "Images/OWLOverrides/Fusion.svg",
    "houston outlaws": "Images/OWLOverrides/Outlaws.svg",
    "boston uprising": "Images/OWLOverrides/Uprising.svg",
    "hangzhou spark": "Images/OWLOverrides/Spark.svg",
};

interface MatchDay
{
    date: Date,
    matches: Response.MatchDetails[];
}

export class OverwatchEvents extends React.Component<owProps>
{
    private splitByDay(matches: Response.MatchDetails[]): MatchDay[]
    {
        const days: MatchDay[] = [];
        while (matches.length > 0)
        {
            const match = matches.shift();
            const matchDay: MatchDay = {
                date: new Date(match.Date),
                matches: [match]
            }

            for (var i = 0; i < matches.length; i++)
            {
                const iMatch = matches[i];
                if (DateUtils.onSameDay(matchDay.date, new Date(iMatch.Date)))
                {
                    matches.splice(i, 1);
                    matchDay.matches.push(iMatch);
                    i--;
                }
            }

            days.push(matchDay);
        }
        return days;
    }

    private getLargePanel(match: Response.MatchDetails): JSX.Element
    {
        const compNamePieces1 = this.splitName(match.Competitor1.Name);
        const compNamePieces2 = this.splitName(match.Competitor2.Name);

        const status = match.IsLive ? match.Score : DateUtils.getTimeString(new Date(match.Date));

        const comp1ClassNames = ["comp", "comp-1"];
        if (this.useBlackText(match.Competitor1)) comp1ClassNames.push("blackText");

        const comp2ClassNames = ["comp", "comp-2"];
        if (this.useBlackText(match.Competitor2)) comp2ClassNames.push("blackText");

        return <div className="largeTile">
            <div className={comp1ClassNames.join(" ")} style={{ backgroundColor: this.getColor(match.Competitor1) }}>
                <img src={this.getImage(match.Competitor1)} className="image" />
                <div className="comp-name-1">{compNamePieces1.piece1}</div>
                <div className="comp-name-2">{compNamePieces1.piece2}</div>
            </div>
            <span className="status">{status}</span>
            <div className={comp2ClassNames.join(" ")} style={{ backgroundColor: this.getColor(match.Competitor2) }}>
                <img src={this.getImage(match.Competitor2)} className="image" />
                <div className="comp-name-1">{compNamePieces2.piece1}</div>
                <div className="comp-name-2">{compNamePieces2.piece2}</div>
            </div>
        </div>
    }

    private getSmallPanel(match: Response.MatchDetails): JSX.Element
    {
        const compNamePieces1 = this.splitName(match.Competitor1.Name);
        const compNamePieces2 = this.splitName(match.Competitor2.Name);

        const status = match.IsLive ? match.Score : DateUtils.getTimeString(new Date(match.Date));

        const comp1ClassNames = ["comp", "comp-1"];
        if (this.useBlackText(match.Competitor1)) comp1ClassNames.push("blackText");

        const comp2ClassNames = ["comp", "comp-2"];
        if (this.useBlackText(match.Competitor2)) comp2ClassNames.push("blackText");

        return <div className="tile">
            <div className={comp1ClassNames.join(" ")} style={{ backgroundColor: this.getColor(match.Competitor1) }}>
                <img src={this.getImage(match.Competitor1)} className="image" />
                <div className="comp-name-1">{compNamePieces1.piece1}</div>
                <div className="comp-name-2">{compNamePieces1.piece2}</div>
            </div>
            <span className="status">{status}</span>
            <div className={comp2ClassNames.join(" ")} style={{ backgroundColor: this.getColor(match.Competitor2) }}>
                <img src={this.getImage(match.Competitor2)} className="image" />
                <div className="comp-name-1">{compNamePieces2.piece1}</div>
                <span className="comp-name-2">{compNamePieces2.piece2}</span>
            </div>
        </div>
    }

    public render(): React.ReactNode 
    {
        const panels: JSX.Element[] = [];

        const matchDays = this.splitByDay(this.props.matches || []);
        const firstMatch = matchDays.shift();
        if (firstMatch)
        {
            let matchPanels = firstMatch.matches.map(m => this.getLargePanel(m));
            panels.push(<span className="ow col">
                <span className="group">
                    <DateHeader dates={[firstMatch.date]} showTimeCells={false}></DateHeader>
                    {matchPanels}
                </span>
            </span>);
        }

        let nextMatches = matchDays.slice(0, 3);
        panels.push(<span className="ow col">
            {nextMatches.map(day =>
                <span className="group">
                    <DateHeader dates={[day.date]} showTimeCells={false}></DateHeader>
                    {day.matches.map(m => this.getSmallPanel(m))}
                </span>)}
        </span>);

        return panels;
    }

    private getImage(competitor: Response.CompetitorDetails): string
    {
        if (imageOverrides[competitor.Name.toLowerCase()])
        {
            return imageOverrides[competitor.Name.toLowerCase()];
        }
        return competitor.ImageURL;
    }

    private getColor(competitor: Response.CompetitorDetails): string
    {
        if (swapColors.indexOf(competitor.Name.toLowerCase()) >= 0)
        {
            return "#" + competitor.SecondaryColor;
        }
        return "#" + competitor.PrimaryColor;
    }

    private useBlackText(competitor: Response.CompetitorDetails): boolean
    {
        const { r, g, b } = this.getRGBComponents(this.getColor(competitor));
        const nThreshold = 105;
        const bgDelta = (r * 0.299) + (g * 0.587) + (b * 0.114);

        return ((255 - bgDelta) < nThreshold);
    }

    private getRGBComponents(color: string)
    {
        const r = color.substring(1, 3);
        const g = color.substring(3, 5);
        const b = color.substring(5, 7);

        return {
            r: parseInt(r, 16),
            g: parseInt(g, 16),
            b: parseInt(b, 16)
        };
    }

    private splitName(name: string): { piece1: string, piece2: string }
    {
        const pieces = name.split(" ");
        const lastPiece = pieces.pop();
        return { piece1: pieces.join(" "), piece2: lastPiece };
    }
}