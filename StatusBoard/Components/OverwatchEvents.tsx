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

interface CompetitorDetails 
{
    name: string;
    imageURL?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

interface APIStage 
{
    matches: APIMatch[];
}

interface APIMatch 
{
    state: "PENDING" | "CONCLUDED";
    competitors: APICompetitor[];
    startDateTS: number;
    scores: { value: string }[];
}

interface APICompetitor 
{
    name: string;
    icon: string;
    primaryColor: string;
    secondaryColor: string;
}

class OverwatchEvents extends EventTile 
{
    public matches: MatchDetails[];
    public state: { matches: MatchDetails[] } = { matches: [] };

    public async load(): Promise<void> 
    {
        const json = await this.get("https://api.overwatchleague.com/schedule?locale=en_US");

        this.parseOWLEvents(json.data.stages);

        this.matches.sort((a: MatchDetails, b: MatchDetails) => 
        {
            return a.date.getTime() - b.date.getTime();
        });
        
        this.setState({
            matches: this.matches
        });
    }

    private parseOWLEvents(stages: APIStage[]) 
    {
        this.matches = [];    
        stages.forEach(stage => {
            stage.matches.forEach(match => {
                if (match.state !== "CONCLUDED" && match.competitors.length === 2) 
                {
                    const isLive: boolean = this.isLive(match);
                    let score = "";
                    if (isLive) 
                    {
                        score = match.scores[0].value + " - " + match.scores[1].value;
                    }

                    this.matches.push({
                        competitor1: this.toDetails(match.competitors[0]),
                        competitor2: this.toDetails(match.competitors[1]),
                        date: new Date(match.startDateTS),
                        isLive: isLive,
                        score: score
                    });
                }
            });
        });
    }

    private isLive(match: APIMatch): boolean 
    { 
        const now = new Date();
        const startDate = new Date(match.startDateTS);
        return startDate.getTime() < now.getTime();
    }

    private toDetails(competitor: APICompetitor): CompetitorDetails {
        return {
            name: competitor.name,
            imageURL: competitor.icon,
            primaryColor: competitor.primaryColor,
            secondaryColor: competitor.secondaryColor,
        };
    }

    private parseWorldCupEvents(json: any): void 
    {
        let brackets: any[] = json.brackets;

        this.matches = [];
        brackets.forEach(bracket => 
        {
            let matches: any[] = bracket.matches;

            matches.forEach(match => 
            {
                if (match.state != "CONCLUDED") 
                {
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
                    if (isLive) 
                    {
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