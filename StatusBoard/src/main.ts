import { StatusBoard } from "./StatusBoard";
import * as ReactDOM from "react-dom";
import * as React from "react";

$(document).ready(function ()
{
    var mainDiv = document.getElementById("main-div");
    ReactDOM.render(React.createElement(StatusBoard), mainDiv);
});