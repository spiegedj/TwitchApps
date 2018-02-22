/// <reference path="../@types/jquery/jquery.d.ts"/>
var Clock = /** @class */ (function () {
    function Clock() {
        this.container = document.createElement("div");
        this.container.id = "clock";
        this.dateElement = document.createElement("div");
        this.dateElement.id = "date";
        this.container.appendChild(this.dateElement);
        this.timeElement = document.createElement("div");
        this.timeElement.id = "time";
        this.container.appendChild(this.timeElement);
        document.body.appendChild(this.container);
        setInterval(this.updateClock.bind(this), 1000);
    }
    Object.defineProperty(Clock.prototype, "element", {
        get: function () {
            return this.container;
        },
        enumerable: true,
        configurable: true
    });
    Clock.prototype.updateClock = function () {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        var ampm = hours > 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours == 0 ? hours + 12 : hours;
        this.dateElement.innerHTML = now.toLocaleDateString("en-us", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        this.timeElement.innerHTML = hours + ":" + minutes + " " + ampm;
    };
    return Clock;
}());
