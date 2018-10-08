class WeatherPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temp: "",
            forecast: []
        };
        this.retrieveWeather();
        var updateRate = 5 * 60 * 1000; // every 5 minutes
        setInterval(this.retrieveWeather.bind(this), updateRate);
    }
    retrieveWeather() {
        const url = "https://query.yahooapis.com/v1/public/yql?";
        const query = "q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='verona, wi')&format=json";
        $.get(url + query, json => this.parseForecast(json));
    }
    parseForecast(data) {
        const item = data.query.results.channel.item;
        const condition = item.condition;
        const forecasts = item.forecast;
        this.setState({
            temp: condition.temp,
            forecast: forecasts.slice(0, 6)
        });
    }
    render() {
        const weatherForecast = this.state.forecast.map(forecast => {
            const imageURL = "./Images/Weather/" + forecast.code + ".png";
            return React.createElement("div", { className: "forecast-day" },
                React.createElement("div", { className: "day" }, forecast.day),
                React.createElement("img", { className: "temp-icon", src: imageURL }),
                React.createElement("span", { className: "forecast-container" },
                    React.createElement("span", { className: "high" },
                        forecast.high,
                        "\u00B0"),
                    React.createElement("span", { className: "low" },
                        forecast.low,
                        "\u00B0")));
        });
        return (React.createElement("div", { className: "weatherPanel" },
            React.createElement(ClockPanel, null),
            React.createElement("div", { className: "temp" },
                this.state.temp,
                "\u00B0"),
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
        var hours = now.getHours();
        var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var ampm = hours > 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours == 0 ? hours + 12 : hours;
        const date = now.toLocaleDateString("en-us", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        const time = hours + ":" + minutes + " " + ampm;
        this.setState({
            date: date,
            time: time
        });
    }
    render() {
        return (React.createElement("div", { className: "clock" },
            React.createElement("div", { className: "clock-date" }, this.state.date),
            React.createElement("div", { className: "clock-time" }, this.state.time)));
    }
}
