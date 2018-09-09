/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>
class StarCraftEvents extends EventTile {
    constructor() {
        super(...arguments);
        this.state = {
            tournaments: []
        };
    }
    load() {
        $.get("https://wcs.starcraft2.com/en-us/schedule/", function (html) {
            this.parseWCSEvents(html);
        }.bind(this));
    }
    parseWCSEvents(html) {
        const doc = $($.parseHTML(html));
        const cards = doc.find(".eventCard-entry");
        this.events = [];
        cards.each((index, card) => {
            const tournament = $(card).find(".metaData-hd").first().children().first().text();
            const stage = $(card).find(".meta-Data-ft").first().children().first().text();
            const logo = $(card).find(".eventCard-logo").first().children().first().attr("src");
            const timestamp = Number($(card).find(".eventCard-time").first().children().first().attr("data-locale-time-timestamp"));
            this.events.push({
                eventName: tournament,
                eventDetails: stage,
                eventLogo: logo,
                eventDate: new Date(timestamp)
            });
        });
        this.events = this.events.filter(this.onFilterEvents.bind(this));
        this.events.sort((a, b) => {
            return a.eventDate.getTime() - b.eventDate.getTime();
        });
        this.setState({
            tournaments: this.createTouraments(this.events)
        });
    }
    onFilterEvents(event) {
        const now = (new Date()).getTime();
        if (event.eventDate && event.eventDate.getTime() < now) {
            return false;
        }
        return true;
    }
    createTouraments(events) {
        const tournaments = {};
        const tournamentArray = [];
        for (let event of events) {
            if (!tournaments[event.eventName]) {
                const tournament = {
                    name: event.eventName,
                    events: []
                };
                tournaments[event.eventName] = tournament;
                tournamentArray.push(tournament);
            }
            tournaments[event.eventName].events.push(event);
        }
        return tournamentArray;
    }
    getClasses() { return "eventTile"; }
    render() {
        const events = this.state.tournaments.map((tournament) => {
            const tournamentRow = React.createElement("tr", null,
                React.createElement("td", { colSpan: 2, className: "tournament-name" }, tournament.name));
            const events = tournament.events.map(event => {
                const isLive = isNaN(event.eventDate.getTime());
                return (React.createElement("tr", { className: isLive ? "live" : "" },
                    React.createElement("td", null, event.eventDetails),
                    React.createElement("td", null, DateUtils.getDateString(event.eventDate))));
            });
            return [tournamentRow, ...events];
        });
        return (React.createElement("div", { className: this.getClasses() },
            React.createElement("table", null,
                React.createElement("tbody", null, events))));
    }
}
class WCSEvents extends StarCraftEvents {
    onFilterEvents(event) {
        if (!event.eventName.includes("WCS")) {
            return false;
        }
        return super.onFilterEvents(event);
    }
    getClasses() {
        return super.getClasses() + " wcs";
    }
}
class GSLEvents extends StarCraftEvents {
    onFilterEvents(event) {
        if (!event.eventName.includes("GSL")) {
            return false;
        }
        return super.onFilterEvents(event);
    }
    getClasses() {
        return super.getClasses() + " gsl";
    }
}
