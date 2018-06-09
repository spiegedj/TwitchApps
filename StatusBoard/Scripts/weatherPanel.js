/// <reference path="../@types/jquery/jquery.d.ts"/>
var WeatherPanel = /** @class */ (function () {
    function WeatherPanel() {
        this.clientID = "dj0yJmk9ZkdkYzF4ajU4a29vJmQ9WVdrOVRXRnJRbnBTTm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02YQ--";
        this.secret = "3662266402e4b32b77481eb7786750a8e849bdd6";
        this.forecastElement = $("<div />", { id: "forecast" });
        $(this.element).append(this.forecastElement);
        this.retrieveWeather();
        var updateRate = 5 * 60 * 1000; // every 5 minutes
        setInterval(this.retrieveWeather.bind(this), updateRate);
    }
    Object.defineProperty(WeatherPanel.prototype, "element", {
        get: function () {
            return document.getElementById("weatherPanel");
        },
        enumerable: true,
        configurable: true
    });
    WeatherPanel.prototype.retrieveWeather = function () {
        $.get("https://query.yahooapis.com/v1/public/yql?" +
            "q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='verona, wi')&format=json", function (json) {
            this.parseForecast(json);
        }.bind(this));
    };
    WeatherPanel.prototype.parseForecast = function (data) {
        var _this = this;
        var item = data.query.results.channel.item;
        var condition = item.condition;
        var forecasts = item.forecast;
        var currentForecast = forecasts[0];
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
        forecasts.some(function (forecast) {
            _this.addForecastElement(forecast);
            if (++count >= 6) {
                return true;
            }
            return false;
        });
    };
    WeatherPanel.prototype.addForecastElement = function (forecast) {
        var tile = $("<div />", { class: "forecast-tile" });
        var image = "./Images/Weather/" + forecast.code + ".png";
        if (forecast.temp) {
            tile.append($("<div />", { class: "temp" }).html(forecast.temp + "&deg;"));
        }
        else {
            tile.append($("<div />", { class: "day" }).html(forecast.day));
        }
        tile.append($("<img />", { class: "temp-icon", src: image }));
        var container = $("<span />", { class: "forecast-container" });
        container.append($("<span />", { class: "high" }).html(forecast.high + "&deg;"));
        container.append($("<span />").html(" / "));
        container.append($("<span />", { class: "low" }).html(forecast.low + "&deg;"));
        $(tile).append(container);
        $(this.forecastElement).append(tile);
    };
    return WeatherPanel;
}());
