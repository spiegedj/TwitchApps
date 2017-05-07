$(document).ready(function() {
    var mainDiv = document.getElementById("main-div");

    var follows = new TwitchFollows(mainDiv, 12, "Follows");
    follows.setPosition(0, "", 0, "");

    var starcraft = new TwitchGame(mainDiv, 5, "Starcraft II");
    starcraft.setPosition(0, 0);   

    var overwatch = new TwitchGame(mainDiv, 5, "Overwatch");
    overwatch.setPosition(500, 0);

    $(document).keypress(function(event) {
        if (event.keyCode === 113 || event.keyCode === 81 || event.keyCode === 53) {
            ipcRenderer.send('stop-stream');
        }
    });
});