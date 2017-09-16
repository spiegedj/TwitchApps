

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

    var weatherPanel = new WeatherPanel();
});