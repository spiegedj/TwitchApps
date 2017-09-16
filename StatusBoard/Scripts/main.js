

$(document).ready(function() {
    var mainDiv = document.getElementById("main-div");

    // Top Left Right Bottom

    var events = new Events(mainDiv, 5);
    events.setPosition(15, 421.66666);

    var follows = new TwitchFollows(mainDiv, 11, "Follows");
    follows.setPosition(15, "", 15, "");
    follows.setHeight(954);

    var starcraft = new TwitchGame(mainDiv, 5, "Starcraft II");
    starcraft.setPosition("", 0, "", 15);

    var overwatch = new TwitchGame(mainDiv, 5, "Overwatch");
    overwatch.setPosition("", 421.66666, "", 15);

    setInterval(updateClock, 1000);
});

updateClock = function() {
    var time = document.getElementById("time");
    var date = document.getElementById("date");
    var now = new Date();

    date.innerHTML = now.toLocaleDateString("en-us", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
    var hours = now.getHours();
    var minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
    var ampm = hours > 12 ? "PM" : "AM";
    hours = hours%12;
    time.innerHTML = hours + ":" + minutes + " " + ampm;

}
