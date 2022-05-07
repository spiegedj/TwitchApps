"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommas = exports.getTextWidth = void 0;
let canvas = null;
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    canvas = canvas || document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return Math.ceil(metrics.width);
}
exports.getTextWidth = getTextWidth;
function addCommas(num) {
    var numString = num.toString();
    var commaString = "";
    for (var i = numString.length; i > 3; i -= 3) {
        commaString = "," + numString.substr(Math.max(0, i - 3), i) + commaString;
    }
    commaString = numString.substr(0, i) + commaString;
    return commaString;
}
exports.addCommas = addCommas;
