"use strict";
/// <reference path="../@types/data.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarCraftEvents = void 0;
const React = require("react");
const DateUtils_1 = require("./DateUtils");
class StarCraftEvents extends React.Component {
    getClasses() { return "eventTile"; }
    render() {
        const events = this.props.tournaments.map((tournament) => {
            const tournamentRow = React.createElement("tr", null,
                React.createElement("td", { colSpan: 2, className: "tournament-name" }, tournament.Name));
            const events = tournament.Days.map(event => {
                const dateString = event.IsLive ? "Live Now" : DateUtils_1.DateUtils.getDateString(new Date(event.Date));
                return (React.createElement("tr", { className: event.IsLive ? "live" : "" },
                    React.createElement("td", null, event.Stage),
                    React.createElement("td", null, dateString)));
            });
            return [tournamentRow, ...events];
        });
        return (React.createElement("div", { className: this.getClasses() },
            React.createElement("table", null,
                React.createElement("tbody", null, events))));
    }
}
exports.StarCraftEvents = StarCraftEvents;
class WCSEvents extends StarCraftEvents {
    getClasses() {
        return super.getClasses() + " wcs";
    }
}
class GSLEvents extends StarCraftEvents {
    getClasses() {
        return super.getClasses() + " gsl";
    }
}
