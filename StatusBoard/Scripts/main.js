

$(document).ready(function() {
    var mainDiv = document.getElementById("main-div");

    // Top Left Right Bottom
    var gridManager = new GridManager({ width: 6, height: 2 });

    var clock = new Clock();
    var weather = new WeatherPanel();
    var events = new Events(mainDiv, 30);
    var follows = new TwitchFollowsAndGames(mainDiv, 30, "");
    var overwatch = new OverwatchLeague(mainDiv, 8, "Overwatch League");

    gridManager.addBlock({ element: weather.element, x: 0, y: 0, w: .5, h: 2});

    gridManager.addBlock({ element: clock.element, x: .5, y: 0, w: 1.5, h: 1});
    gridManager.addBlock({ element: events.element, x: 2, y: 0, w: 2, h: 1});

    gridManager.addBlock({ element: overwatch.element, x: .5, y: 1, w: 3.5, h: 1});

    gridManager.addBlock({ element: follows.element, x: 4, y: 0, w: 2, h: 2});

    gridManager.resize($(window).width(), $(window).height());

    $(window).resize(function() {
        gridManager.resize($(window).width(), $(window).height());
    });

    setInterval(changeTheme, 10 * 60 * 1000);
});

changeTheme = function() {
    var darkStart = 22; // 10 PM
    var darkEnd = 5; // 5 AM

    var nowHour = new Date().getHours();

    if (nowHour > darkStart || nowHour < darkEnd) {
       document.body.className = "dark";
    } else {
        document.body.className = "light";
    }
}