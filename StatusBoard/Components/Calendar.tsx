/// <reference path="StarCraftEvents.tsx"/>
/// <reference path="OverwatchEvents.tsx"/>

abstract class EventTile extends React.Component
{
    constructor(props: any)
    {
        super(props);

        setInterval(() => this.load(), 60 * 1000);
        this.load();
    }

    protected get(url: string): Promise<any>
    {
        return new Promise(resolve =>
        {
            $.get(url, result => resolve(result));
        });
    }

    public abstract load(): void;
}

class Calendar extends React.Component 
{
    public render(): React.ReactNode 
    {
        return (
            <div className="calendar card">
                <GDQEvents />
                <OWLEvents />
            </div>
        );
    }
}
