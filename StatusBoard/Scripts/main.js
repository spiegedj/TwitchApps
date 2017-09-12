

$(document).ready(function() {
    var mainDiv = document.getElementById("main-div");

    var events = new Events(mainDiv, 5, "Overwatch");
    events.setPosition(0, 0);

    var overwatch = new TwitchGame(mainDiv, 5, "Overwatch");
    overwatch.setPosition(0, 350);

    var follows = new TwitchFollows(mainDiv, 12, "Follows");
    follows.setPosition(0, "", 0, "");

    var starcraft = new TwitchGame(mainDiv, 5, "Starcraft II");
    starcraft.setPosition(0, "", 350);

    setInterval(updateClock, 1000);
});

updateClock = function() {
    var time = document.getElementById("time");
    var date = document.getElementById("date");
    var now = new Date();


    date.innerHTML = now.toLocaleDateString("en-us", {weekday: "long", month: "long", day: "numeric", year: "numeric"});
    time.innerHTML = now.toLocaleTimeString("en-us", {hour: '2-digit', minute:'2-digit'});

}
