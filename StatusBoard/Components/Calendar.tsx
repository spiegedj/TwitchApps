/// <reference path="StarCraftEvents.tsx"/>

abstract class EventTile extends React.Component {

    constructor(props: any) {
        super(props);

        setInterval(() => this.load(), 60 * 1000);
        this.load();
    }

    public abstract load(): void;
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
    }

    public render(): React.ReactNode 
    {
        return (
            <div className = "calendar card">
                <WCSEvents />
                <GSLEvents />
                <StarCraftEvents />
            </div>
        );
    }
}
