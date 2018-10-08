interface Condition {
    code: string,
    date: string,
    temp: string,
    text: string
}

interface Forecast {
    code: string,
    date: string,
    day: string,
    high: string,
    low: string,
    text: string
}

class WeatherPanel extends React.Component
{
    public state: { temp: string, forecast: Forecast[] } = 
    {
        temp: "",
        forecast: []
    }

    public constructor(props: any) 
    {
        super(props);

        this.retrieveWeather();
        var updateRate = 5 * 60 * 1000; // every 5 minutes
        setInterval(this.retrieveWeather.bind(this), updateRate);
    }

    private retrieveWeather() 
    {
        const url = "https://query.yahooapis.com/v1/public/yql?";
        const query = "q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='verona, wi')&format=json";
        $.get(url + query, json => this.parseForecast(json));
    }

    private parseForecast(data: any): void 
    {
        const item = data.query.results.channel.item;
        const condition : Condition = item.condition;
        const forecasts: Forecast[] = item.forecast;
        this.setState({
            temp: condition.temp,
            forecast: forecasts.slice(0, 6)
        });
    }

    public render(): React.ReactNode 
    {
        const weatherForecast = this.state.forecast.map(forecast => {
            const imageURL = "./Images/Weather/" + forecast.code + ".png";
            return <div className="forecast-day">
                <div className="day">{forecast.day}</div>
                <img className="temp-icon" src={imageURL}></img>
                <span className="forecast-container">
                    <span className="high">{forecast.high}&deg;</span>
                    <span className="low">{forecast.low}&deg;</span>
                </span>
            </div>;
        });

        return (
            <div className="weatherPanel">
                <ClockPanel />
                <div className="temp">
                    {this.state.temp}&deg;
                </div>
                { weatherForecast }
            </div>
        );
    }
}

class ClockPanel extends React.Component 
{
    public state: { date: string, time: string } = { date: "", time: "" };

    public constructor(props: any) 
    {
        super(props);
        setInterval(this.updateClock.bind(this), 1000);
        this.updateClock();
    }

    private updateClock() : void {
        var now = new Date();

        var hours = now.getHours();
        var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var ampm = hours > 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours == 0 ? hours + 12 : hours;

        const date = now.toLocaleDateString("en-us", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
        const time = hours + ":" + minutes + " " + ampm;

        this.setState({
            date: date,
            time: time
        });
    }

    public render(): React.ReactNode 
    {
        return (
            <div className="clock">
                <div className="clock-date">{this.state.date}</div>
                <div className="clock-time">{this.state.time}</div>
            </div>
        );
    }
}