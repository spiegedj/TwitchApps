

$(document).ready(function() {
    var mainDiv = document.getElementById("main-div");
    // var e = React.createElement;
    // ReactDOM.render(e(EventTile), mainDiv);

    // Top Left Right Bottom
    var gridManager = new GridManager({ width: 6, height: 6 });

    var clock = new Clock();
    var weather = new WeatherPanel();
    var follows = new TwitchFollowsAndGames(mainDiv, 30, "");

    var calendarEl = document.createElement("div");
    mainDiv.appendChild(calendarEl);
    ReactDOM.render(React.createElement(Calendar), calendarEl);

    //var tournaments = new Tournaments(mainDiv, 30);
    //var overwatch = new OverwatchLeague(mainDiv, 8, "Overwatch League");

    gridManager.addBlock({ element: weather.element, x: 0, y: 0, w: .5, h: 6});

    gridManager.addBlock({ element: clock.element, x: .5, y: 0, w: 3.5, h: 1});
    gridManager.addBlock({ element: calendarEl, x: .5, y: 1, w: 3.5, h: 5 });

    //gridManager.addBlock({ element: tournaments.element, x: 2, y: 0, w: 2, h: 1});

    //gridManager.addBlock({ element: overwatch.element, x: .5, y: 1, w: 3.5, h: 1});

    gridManager.addBlock({ element: follows.element, x: 4, y: 0, w: 2, h: 6});

    gridManager.resize($(window).width(), $(window).height());

    $(window).resize(function() {
        gridManager.resize($(window).width(), $(window).height());
    });
});