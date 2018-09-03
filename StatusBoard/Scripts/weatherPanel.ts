
class WeatherPanel {

    private timeElement : HTMLElement;
    private dateElement : HTMLElement;
    private conditionsElements : JQuery;
    private forecastElement : JQuery;

    private clientID = "dj0yJmk9ZkdkYzF4ajU4a29vJmQ9WVdrOVRXRnJRbnBTTm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02YQ--";
    private secret = "3662266402e4b32b77481eb7786750a8e849bdd6";

    public get element(): HTMLElement {
        return document.getElementById("weatherPanel");
    }

    public constructor() {
        this.forecastElement = $("<div />", {id: "forecast"});
        $(this.element).append(this.forecastElement);

        this.retrieveWeather();
        var updateRate = 5 * 60 * 1000; // every 5 minutes
        setInterval(this.retrieveWeather.bind(this), updateRate);
    }

    private retrieveWeather() {
        $.get("https://query.yahooapis.com/v1/public/yql?" + 
            "q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='verona, wi')&format=json", function(json) {
            this.parseForecast(json);
        }.bind(this));
    }

    private parseForecast(data: any): void {
        var item = data.query.results.channel.item;
        var condition : Condition = item.condition;
        var forecasts: Forecast[] = item.forecast;

        var currentForecast: Forecast = forecasts[0];
        currentForecast.temp = condition.temp;

        // forecasts.unshift({
        //     code: condition.code,
        //     date: "Today",
        //     day: "today",
        //     high: currentForecast.high,
        //     low: currentForecast.low,
        //     text: condition.text
        // });

        var count = 0;
        $(this.forecastElement).empty();
        forecasts.some((forecast) => {
            this.addForecastElement(forecast);
            if (++count >= 6) { return true; }
            return false;
        });
    }

    private addForecastElement(forecast: Forecast) {
        var tile = $("<div />", {class: "forecast-tile" });

        var image = "./Images/Weather/" + forecast.code + ".png";
        if (forecast.temp) {
            tile.append($("<div />" , { class: "temp"}).html(forecast.temp + "&deg;"));
        } else {
            tile.append($("<div />" , { class: "day"}).html(forecast.day));
        }
        tile.append($("<img />" , { class: "temp-icon", src: image}));

        var container = $("<span />", { class: "forecast-container"});
            container.append($("<span />" , { class: "high"}).html(forecast.high + "&deg;"));
            container.append($("<span />").html(" / "));
            container.append($("<span />" , { class: "low"}).html(forecast.low + "&deg;"));

        $(tile).append(container);
        $(this.forecastElement).append(tile);
    }
}

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
    temp: string,
    text: string
}