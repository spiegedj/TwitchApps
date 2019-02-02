class WeatherPanel extends React.Component {
    render() {
        const condition = this.props.weather.Condition;
        const conditionElement = React.createElement("div", { className: "condition" },
            React.createElement("div", null, "Now"),
            React.createElement("div", { className: "temp-icon", dangerouslySetInnerHTML: { __html: condition.Icon } }),
            React.createElement("div", null, condition.Phrase),
            React.createElement("div", { className: "temp" }, condition.Temp),
            React.createElement("div", null, condition.FeelsLike));
        const forecast = this.props.weather.Forecast.slice(0, 4);
        const weatherForecast = forecast.map((forecast, i) => {
            const classes = "f" + i + " forecast-day";
            return React.createElement("div", { className: classes },
                React.createElement("div", { className: "day" }, forecast.Date),
                React.createElement("div", { className: "temp-icon", dangerouslySetInnerHTML: { __html: forecast.Icon } }),
                React.createElement("div", null, forecast.Description),
                React.createElement("div", { className: "temp" },
                    React.createElement("span", null, forecast.High),
                    React.createElement("span", { className: "slash" }),
                    React.createElement("span", null, forecast.Low)),
                React.createElement("div", null,
                    React.createElement("svg", { className: "icon-drop", viewBox: "0 0 200 200", transform: "scale(4) translate(3, -3)" },
                        React.createElement("use", { className: "svg-drop", href: "#svg-symbol-drop" })),
                    React.createElement("span", null, forecast.Precipitation)));
        });
        return (React.createElement("div", { className: "weatherPanel" },
            React.createElement(ClockPanel, null),
            conditionElement,
            weatherForecast));
    }
}
class ClockPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: "", time: "" };
        setInterval(this.updateClock.bind(this), 1000);
        this.updateClock();
    }
    updateClock() {
        var now = new Date();
        const date = now.toLocaleDateString("en-us", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        const time = DateUtils.getTimeString(now);
        this.setState({
            date: date,
            time: time
        });
    }
    render() {
        return (React.createElement("div", { className: "clock" },
            React.createElement("div", null,
                React.createElement("div", { className: "clock-date" }, this.state.date),
                React.createElement("div", { className: "clock-time" }, this.state.time))));
    }
}
