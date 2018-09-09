/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>

interface EventDetails 
{
    eventName: string,
    eventDetails: string,
    eventLogo: string,
    eventDate: Date
}

interface Tournament
{
    name: string,
    events: EventDetails[]
}


class StarCraftEvents extends EventTile 
{
    public events: EventDetails[];
    public state: { tournaments: Tournament[] } = { 
        tournaments: [] 
    };

    public load(): void {
        $.get("https://wcs.starcraft2.com/en-us/schedule/", function(html) {
            this.parseWCSEvents(html);
        }.bind(this));
    }

    private parseWCSEvents(html: string): void 
    {
        const doc = $($.parseHTML(html));
        const cards = doc.find(".eventCard-entry");

        this.events = [];
        cards.each((index: number, card: Node[]) => {
            const tournament = $(card).find(".metaData-hd").first().children().first().text();
            const stage = $(card).find(".meta-Data-ft").first().children().first().text();
            const logo = $(card).find(".eventCard-logo").first().children().first().attr("src");
            const timestamp = Number($(card).find(".eventCard-time").first().children().first().attr("data-locale-time-timestamp"));

            this.events.push({
                eventName: tournament,
                eventDetails: stage,
                eventLogo: logo,
                eventDate: new Date(timestamp)
            });
        });

        this.events = this.events.filter(this.onFilterEvents.bind(this));
        this.events.sort((a: EventDetails, b: EventDetails) => {
            return a.eventDate.getTime() - b.eventDate.getTime();
        });
        
        this.setState({
            tournaments: this.createTouraments(this.events)
        });
    }

    protected onFilterEvents(event: EventDetails) {
        const now = (new Date()).getTime();
        if (event.eventDate && event.eventDate.getTime() < now) {
            return false;
        }

        return true;
    }

    private createTouraments(events: EventDetails[]): Tournament[] 
    {
        const tournaments: { [key: string]: Tournament} = {};
        const tournamentArray: Tournament[] = [];
        
        for (let event of events) 
        {
            if (!tournaments[event.eventName]) {
                const tournament: Tournament = {
                    name: event.eventName,
                    events: []
                }
                tournaments[event.eventName] = tournament;
                tournamentArray.push(tournament);
            }
            tournaments[event.eventName].events.push(event);
        }
        
        return tournamentArray;
    }

    protected getClasses(): string { return "eventTile"; }
    
    public render(): React.ReactNode 
    {
        
        const events = this.state.tournaments.map((tournament: Tournament) => {
            const tournamentRow = <tr><td colSpan={2} className="tournament-name" >{tournament.name}</td></tr>;
            const events = tournament.events.map(event => {
                const isLive = isNaN(event.eventDate.getTime());
                return (
                <tr className={isLive ? "live" : ""}>
                    <td>{event.eventDetails}</td>
                    <td>{DateUtils.getDateString(event.eventDate)}</td>
                </tr>);
            });

            return [tournamentRow, ...events];
        })

        return (
            <div className = { this.getClasses() }>
                <table>
                    <tbody>
                         { events }
                    </tbody>
                </table>
            </div>
        );
    }
}

class WCSEvents extends StarCraftEvents 
{
    protected onFilterEvents(event: EventDetails) {
        if (!event.eventName.includes("WCS")) {
            return false;
        }

        return super.onFilterEvents(event);
    }

    protected getClasses(): string {
        return super.getClasses() + " wcs";
    }
}

class GSLEvents extends StarCraftEvents 
{
    protected onFilterEvents(event: EventDetails) {
        if (!event.eventName.includes("GSL")) {
            return false;
        }

        return super.onFilterEvents(event);
    }

    protected getClasses(): string {
        return super.getClasses() + " gsl";
    }
}