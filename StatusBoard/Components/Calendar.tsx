interface EventDetails 
{
    eventName: string,
    eventDetails: string,
    eventLogo: string,
    eventDate: Date
}

class EventTile extends React.Component {
    props: { details: EventDetails }

    private get details(): EventDetails {
        return this.props.details;
    }

    public render(): React.ReactNode {
        return (
            <div className = "eventTile"> 
                <div className="eventName" >{ this.details.eventName }</div>
                <div>{ this.details.eventDetails }</div>
                <img className="eventLogo" src={ this.details.eventLogo } />
                <div>{ DateUtils.getDateString(this.details.eventDate) }</div>
                <div>{ DateUtils.getCountdownString(this.details.eventDate) }</div>                
            </div>
        );
    }
}

class Calendar extends React.Component 
{
    state: { events: EventDetails[] };

    constructor(props) 
    {
        super(props)
        this.state = {
            events: []
        };
        this.wcsEvents();
    }

    private wcsEvents(): void 
    {
        $.get("https://wcs.starcraft2.com/en-us/schedule/", function(html) {
            this.parseWCSEvents(html);
        }.bind(this));
    }

    private parseWCSEvents(html: string): void 
    {
        const doc = $($.parseHTML(html));
        const cards = doc.find(".eventCard-entry");

        const events: EventDetails[] = [];
        cards.each((index: number, card: Node[]) => {
            const tournament = $(card).find(".metaData-hd").first().children().first().text();
            const stage = $(card).find(".meta-Data-ft").first().children().first().text();
            const logo = $(card).find(".eventCard-logo").first().children().first().attr("src");
            const timestamp = Number($(card).find(".eventCard-time").first().children().first().attr("data-locale-time-timestamp"));

            events.push({
                eventName: tournament,
                eventDetails: stage,
                eventLogo: logo,
                eventDate: new Date(timestamp)
            });
        });

        events.length = 6;

        this.setState({
            events: events
        });
    }

    public render(): React.ReactNode 
    {
        const tiles = this.state.events.map((details) => { 
            return <EventTile details={ details } /> 
        });

        return (
            <div className = "calendar card">
                { tiles }
            </div>
        );
    }
}

// $(document).ready(function() {
//     ReactDOM.render(<Calendar />, document.getElementById("main-div"));
// });