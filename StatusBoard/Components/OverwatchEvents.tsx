/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>

interface MatchDetails 
{
    competitor1: CompetitorDetails
    competitor2: CompetitorDetails
    date: Date;
    isLive: boolean;
    score: string;
}

interface CompetitorDetails {
    name: string;
    imageURL?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

class OverwatchEvents extends EventTile 
{
    public matches: MatchDetails[];
    public state: { matches: MatchDetails[] } = { 
        matches: [] 
    };

    public load(): void 
    {
        $.get("https://worldcup.playoverwatch.com/en-us/ajax/round-robin?year=2018", function(html) {
            this.parseWorldCupEvents(html);
        }.bind(this));
    }

    private parseWorldCupEvents(json: any): void 
    {
        let brackets: any[] = json.brackets;

        this.matches = [];
        brackets.forEach(bracket => {
            let matches: any[] = bracket.matches;

            matches.forEach(match => {
                if (match.state != "CONCLUDED") {

                    const comp1Name = match.competitors[0].name;
                    const comp2Name = match.competitors[1].name;

                    const comp1: CompetitorDetails = 
                    {
                        name: comp1Name,
                        imageURL: this.getCompImage(comp1Name),
                        primaryColor: "",
                        secondaryColor: "",
                    }

                    const comp2: CompetitorDetails = 
                    {
                        name: comp2Name,
                        imageURL: this.getCompImage(comp2Name),
                        primaryColor: "",
                        secondaryColor: "",
                    }

                    const startDate = new Date(match.startDate.timestamp);
                    const now = new Date().getTime();
                    const isLive: boolean = startDate.getTime() < now;
                    let score = "";
                    if (isLive) {
                        score = match.scores[0].value + " - " + match.scores[1].value;
                    }


                    this.matches.push({
                        competitor1: comp1,
                        competitor2: comp2,
                        date: new Date(match.startDate.timestamp),
                        isLive: isLive,
                        score: score
                    });
                }
            })
        });

        this.matches.sort((a: MatchDetails, b: MatchDetails) => 
        {
            return a.date.getTime() - b.date.getTime();
        });
        
        this.setState({
            matches: this.matches
        });
    }
    
    private getCompImage(name: string)
    {
        return `https://static-wcs.starcraft2.com/flags/${name}.png`;
    }

    public render(): React.ReactNode 
    {
        let lastDate: number = -1;
        const matches = this.state.matches.map((match: MatchDetails) => 
        {
            let dateLine: JSX.Element;
            if (lastDate != match.date.getDate()) 
            {
                dateLine = <div className="match-date">{DateUtils.getDayString(match.date)}</div>;
                lastDate = match.date.getDate();
            }

            const matchStatus = match.isLive ? match.score : DateUtils.getTimeString(match.date);
            const matches = 
                <div className="matchTile">
                    <span className="comp-1">
                        <img src={match.competitor1.imageURL} className="comp-image" />
                        <span className="comp-name">{match.competitor1.name}</span>
                    </span>
                    <span className="match-time">{matchStatus}</span>
                    <span className="comp-2">
                        <img src={match.competitor2.imageURL} className="comp-image" />
                        <span className="comp-name">{match.competitor2.name}</span>
                    </span>
                </div>

            return [dateLine, matches];
        });

        return (
            <div className="eventTile ow">
                { matches }
            </div>
        );
    }
}