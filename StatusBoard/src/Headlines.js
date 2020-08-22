"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Headlines = void 0;
const React = require("react");
exports.Headlines = ({ headlines }) => {
    return React.createElement("div", { className: "marquee" },
        React.createElement("div", null, headlines.map(headline => React.createElement("span", { className: "headline", dangerouslySetInnerHTML: { __html: headline.Title } }))));
};
