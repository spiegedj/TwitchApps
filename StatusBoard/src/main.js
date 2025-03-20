"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatusBoard_1 = require("./StatusBoard");
const ReactDOM = require("react-dom");
const React = require("react");
require("./WeatherEffects");
$(document).ready(function () {
    var mainDiv = document.getElementById("main-div");
    ReactDOM.render(React.createElement(StatusBoard_1.StatusBoard), mainDiv);
});
const backgrounds = [
    "back1.jpg",
    //"back2.jpg",
    //"back3.png",
    //"back4.jpg",
    "back5.jpg",
    //"back6.png",
    //"back7.jpg",
    "back8.jpg",
    //"back9.jpg",
    //"back10.jpg",
    "back11.jpg",
    "back12.jpg",
    //"back13.jpg",
];
let i = 1;
setInterval(() => {
    i = (i + 1) % backgrounds.length;
    document.body.style.backgroundImage = `url(./Images/${backgrounds[i]})`;
}, 60 * 60 * 1000);
