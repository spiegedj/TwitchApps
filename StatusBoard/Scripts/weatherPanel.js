/// <reference path="../@types/jquery/jquery.d.ts"/>
var WeatherPanel = (function () {
    function WeatherPanel() {
        this.clientID = "dj0yJmk9ZkdkYzF4ajU4a29vJmQ9WVdrOVRXRnJRbnBTTm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02YQ--";
        this.secret = "3662266402e4b32b77481eb7786750a8e849bdd6";
        this.timeElement = document.getElementById("time");
        this.dateElement = document.getElementById("date");
        this.tempElement = document.getElementById("temp");
        this.tempIconElement = document.getElementById("temp-icon");
        setInterval(this.updateClock.bind(this), 1000);
        //this.updateWeather(forecast);
        this.retrieveCurrentConditions();
        var updateRate = 5 * 60 * 1000; // every 5 minutes
        setInterval(this.retrieveCurrentConditions.bind(this), updateRate);
    }
    WeatherPanel.prototype.updateClock = function () {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var ampm = hours > 12 ? "PM" : "AM";
        hours = hours % 12;
        this.dateElement.innerHTML = now.toLocaleDateString("en-us", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        this.timeElement.innerHTML = hours + ":" + minutes + " " + ampm;
    };
    WeatherPanel.prototype.retrieveCurrentConditions = function () {
        $.get("https://query.yahooapis.com/v1/public/yql?" +
            "q=select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='verona, wi')&format=json", function (json) {
            this.parseCurrentCondtions(json);
        }.bind(this));
    };
    WeatherPanel.prototype.parseCurrentCondtions = function (data) {
        var condition = data.query.results.channel.item.condition;
        this.tempElement.innerHTML = condition.temp + "&deg;";
        this.tempIconElement.src = "./Images/Weather/" + condition.code + ".png";
    };
    WeatherPanel.prototype.retrieveForcast = function () {
        $.get("https://query.yahooapis.com/v1/public/yql?" +
            "q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text=%27verona,%20wi%27)&format=json", function (json) {
            this.parseForecast(json);
        }.bind(this));
    };
    WeatherPanel.prototype.parseForecast = function (data) {
        var forecast = data.query.results.channel.item.forecast;
        this.tempElement.innerHTML = forecast[0].high;
    };
    return WeatherPanel;
}());
