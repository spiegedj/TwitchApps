type weatherProps = Partial<{
    weather: Response.Weather
}>;

class WeatherPanel extends React.Component<weatherProps>
{
    public render(): React.ReactNode 
    {
        const condition = this.props.weather.Condition;
        const conditionElement = <div className="condition">
            <div>Now</div>
            <div className="temp-icon" dangerouslySetInnerHTML={{ __html: condition.Icon }}></div>
            <div>{condition.Phrase}</div>
            <div className="temp">{condition.Temp}</div>
            <div>{condition.FeelsLike}</div>
        </div>;

        const forecast = this.props.weather.Forecast.slice(0, 5);
        const weatherForecast = forecast.map((forecast, i) =>
        {
            const classes = "f" + i + " forecast-day";
            return <div className={classes}>
                <div className="day">{forecast.Date}</div>
                <div className="temp-icon" dangerouslySetInnerHTML={{ __html: forecast.Icon }}></div>
                <div>{forecast.Description}</div>
                <div className="temp">
                    <span>{forecast.High}</span>
                    <span className="slash"></span>
                    <span>{forecast.Low}</span>
                </div>
                <div>
                    <svg className="icon-drop" viewBox="0 0 200 200" transform="scale(4) translate(3, -3)">
                        <use className="svg-drop" href="#svg-symbol-drop"></use>
                    </svg>
                    <span>{forecast.Precipitation}</span>
                </div>
            </div>;
        });

        return (
            <div className="weatherPanel">
                <ClockPanel />
                {conditionElement}
                {weatherForecast}
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

    private updateClock(): void
    {
        var now = new Date();
        const date = now.toLocaleDateString("en-us",
            { weekday: "long", month: "long", day: "numeric", year: "numeric" }
        );
        const time = DateUtils.getTimeString(now);

        this.setState({
            date: date,
            time: time
        });
    }

    public render(): React.ReactNode 
    {
        return (
            <div className="clock">
                <div>
                    <div className="clock-date">{this.state.date}</div>
                    <div className="clock-time">{this.state.time}</div>
                </div>
            </div>
        );
    }
}