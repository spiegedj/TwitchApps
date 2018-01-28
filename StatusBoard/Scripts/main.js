

$(document).ready(function() {
    var mainDiv = document.getElementById("main-div");

    // Top Left Right Bottom
    var gridManager = new GridManager({ width: 3, height: 2 });

    var weatherPanel = new WeatherPanel();
    var events = new Events(mainDiv, 30);
    var follows = new TwitchFollowsAndGames(mainDiv, 30, "");
    var overwatch = new OverwatchLeague(mainDiv, 7, "Overwatch League");

    gridManager.addBlock({ element: weatherPanel.element, x: 0, y: 0, w: 1, h: 1});
    gridManager.addBlock({ element: events.element, x: 1, y: 0, w: 1, h: 1});
    gridManager.addBlock({ element: follows.element, x: 2, y: 0, w: 1, h: 2});
    gridManager.addBlock({ element: overwatch.element, x: 0, y: 1, w: 2, h: 1});

    gridManager.resize($(window).width(), $(window).height());

    $(window).resize(function() {
        gridManager.resize($(window).width(), $(window).height());
    });
});