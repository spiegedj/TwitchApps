$(document).ready(function ()
{
    var mainDiv = document.getElementById("main-div");
    // var e = React.createElement;
    // ReactDOM.render(e(EventTile), mainDiv);

    // Top Left Right Bottom
    var gridManager = new GridManager({ width: 10, height: 1 });


    var calendarEl = document.createElement("div");
    mainDiv.appendChild(calendarEl);
    ReactDOM.render(React.createElement(Calendar), calendarEl);

    var follows = new TwitchFollowsAndGames(mainDiv, 30, "");

    gridManager.addBlock({ element: calendarEl, x: 0, y: 0, w: 7, h: 1 });

    gridManager.addBlock({ element: follows.element, x: 7, y: 0, w: 3, h: 1 });

    gridManager.resize($(window).width(), $(window).height());

    $(window).resize(function ()
    {
        gridManager.resize($(window).width(), $(window).height());
    });
});