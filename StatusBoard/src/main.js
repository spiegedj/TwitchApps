"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StatusBoard_1 = require("./StatusBoard");
const ReactDOM = require("react-dom");
const React = require("react");
$(document).ready(function () {
    var mainDiv = document.getElementById("main-div");
    ReactDOM.render(React.createElement(StatusBoard_1.StatusBoard), mainDiv);
});
