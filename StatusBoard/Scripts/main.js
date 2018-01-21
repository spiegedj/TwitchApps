

$(document).ready(function() {
    var mainDiv = document.getElementById("main-div");

    // Top Left Right Bottom

    var events = new Events(mainDiv, 5);
    events.setPosition(15, 421.66666);

    var follows = new TwitchFollows(mainDiv, 11, "Follows");
    follows.setPosition(15, "", 15, "");
    follows.setHeight(954);

    var overwatch = new OverwatchLeague(mainDiv, 7, "Overwatch League");
    overwatch.setPosition("", 0, "", 15);
    overwatch.setWidth(788.3333);

    var weatherPanel = new WeatherPanel();
});