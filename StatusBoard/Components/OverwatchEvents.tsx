/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>

type owProps = Partial<{
    matches: Response.MatchDetails[]
}>;

class OverwatchEvents extends React.Component<owProps>
{
    public render(): React.ReactNode 
    {
        let lastDate: string = "";
        const matches = this.props.matches.map((match: Response.MatchDetails) => 
        {
            let dateLine: JSX.Element;
            const dayString = DateUtils.getDayString(new Date(match.Date));
            if (lastDate != dayString) 
            {
                dateLine = <div className="match-date">{dayString}</div>;
                lastDate = dayString;
            }

            const matchStatus = match.IsLive ? match.Score : DateUtils.getTimeString(new Date(match.Date));
            const matches =
                <div className="matchTile">
                    <span className="comp-name comp-1">{match.Competitor1.Name}</span>
                    <img src={match.Competitor1.ImageURL} className="comp-image" />

                    <span className="match-time">{matchStatus}</span>

                    <img src={match.Competitor2.ImageURL} className="comp-image" />
                    <span className="comp-name comp-2">{match.Competitor2.Name}</span>
                </div>

            return [dateLine, matches];
        });

        return (
            <div className="eventTile ow">
                {matches}
            </div>
        );
    }
}