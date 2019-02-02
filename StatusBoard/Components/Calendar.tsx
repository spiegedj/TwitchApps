/// <reference path="StarCraftEvents.tsx"/>
/// <reference path="OverwatchEvents.tsx"/>

class Calendar extends React.Component 
{
    public state: { data: Response.Data };

    constructor(props: any)
    {
        super(props);

        setInterval(() => this.load(), 60 * 1000);
        this.load();

        this.state = {
            data: {
                Starcraft: { WCS: [], GSL: [] },
                Overwatch: [],
                GDQ: [],
                Weather: { Condition: {} as any, Forecast: [] }
            }
        };
    }

    protected get(url: string): Promise<any>
    {
        return new Promise(resolve =>
        {
            $.get(url, result => resolve(result));
        });
    }

    public async load(): Promise<void>
    {
        const data = await this.get("http://192.168.1.4:3000/StatusBoard") as Response.Data;
        this.setState({
            data: data
        });
    }

    public render(): React.ReactNode 
    {
        return (
            <div className="calendar card">
                <WeatherPanel weather={this.state.data.Weather} />
                <WCSEvents tournaments={this.state.data.Starcraft.WCS} />
                <GSLEvents tournaments={this.state.data.Starcraft.GSL} />
                <OverwatchEvents matches={this.state.data.Overwatch} />
            </div>
        );
    }
}
