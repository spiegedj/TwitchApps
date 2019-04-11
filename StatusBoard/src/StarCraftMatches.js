"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const DateUtils_1 = require("./DateUtils");
class StarCraftMatches extends React.Component {
    getColumn(groups) {
        const groupElements = groups.map(group => {
            const date = new Date(group.Date);
            const playerTable = [];
            for (var i = 0; i < group.Players.length; i += 2) {
                const player1 = group.Players[i];
                let player2 = group.Players[i + 1];
                if (!player2)
                    player2 = { Name: "", Race: "" };
                playerTable.push(React.createElement("tr", null,
                    React.createElement("td", { className: "playerLeft " + player1.Race.toLowerCase() },
                        player1.Name,
                        React.createElement("span", { className: "icon" })),
                    React.createElement("td", { className: "playerRight " + player2.Race.toLowerCase() },
                        player2.Name,
                        React.createElement("span", { className: "icon" }))));
            }
            return React.createElement("span", { className: "group" },
                React.createElement("div", { className: "groupName" }, group.Name),
                React.createElement("div", { className: "date" }, DateUtils_1.DateUtils.getDateString(date)),
                React.createElement("table", { className: "playerTable" }, playerTable));
        });
        return (React.createElement("div", { className: "sc2 col" }, groupElements));
    }
    render() {
        const totalRows = 23;
        const columns = 2;
        const columnEls = [];
        const groups = this.props.groups;
        for (var i = 0; i < columns; i++) {
            const columnGroup = [];
            let j = 0;
            while (groups.length > 0) {
                const nextGroup = groups[0];
                j += (2 + (nextGroup.Players.length / 2));
                if (j > totalRows)
                    break;
                columnGroup.push(groups.shift());
            }
            columnEls.push(this.getColumn(columnGroup));
        }
        return columnEls;
    }
}
exports.StarCraftMatches = StarCraftMatches;
