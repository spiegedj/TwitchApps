/// <reference path="../@types/jquery/jquery.d.ts"/>

class WeatherPanel {

    private timeElement : HTMLElement;
    private dateElement : HTMLElement;
    private conditionsElements : HTMLElement;
    private tempIconElement : HTMLImageElement;

    private clientID = "dj0yJmk9ZkdkYzF4ajU4a29vJmQ9WVdrOVRXRnJRbnBTTm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02YQ--";
    private secret = "3662266402e4b32b77481eb7786750a8e849bdd6";

    public constructor() {
        this.timeElement = document.getElementById("time");
        this.dateElement = document.getElementById("date");
        this.conditionsElements = document.getElementById("conditions");
        this.tempIconElement = document.getElementById("temp-icon") as HTMLImageElement;

        setInterval(this.updateClock.bind(this), 1000);
        
        this.retrieveWeather();
        var updateRate = 5 * 60 * 1000; // every 5 minutes
        setInterval(this.retrieveWeather.bind(this), updateRate);
    }

    private updateClock() : void {
        var now = new Date();

        var hours = now.getHours();
        var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var ampm = hours > 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours == 0 ? hours + 12 : hours;

        this.dateElement.innerHTML = now.toLocaleDateString("en-us", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
        this.timeElement.innerHTML = hours + ":" + minutes + " " + ampm;
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
        var forecast: Forecast[] = item.forecast;

        var currentForecast: Forecast = forecast.shift();
        $(this.conditionsElements).find(".temp-icon:first").attr("src", "./Images/Weather/" + condition.code + ".png");
        $(this.conditionsElements).find(".temp:first").html(condition.temp + "&deg;");
        $(this.conditionsElements).find(".high:first").html(currentForecast.high + "&deg;");
        $(this.conditionsElements).find(".low:first").html(currentForecast.low + "&deg;");
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
    text: string
}