/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class OverwatchEvents extends EventTile {
    constructor() {
        super(...arguments);
        this.state = { matches: [] };
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.get("https://api.overwatchleague.com/schedule?locale=en_US");
            this.parseOWLEvents(json.data.stages);
            this.matches.sort((a, b) => {
                return a.date.getTime() - b.date.getTime();
            });
            this.setState({
                matches: this.matches
            });
        });
    }
    parseOWLEvents(stages) {
        this.matches = [];
        stages.forEach(stage => {
            stage.matches.forEach(match => {
                if (match.state !== "CONCLUDED" && match.competitors.length === 2) {
                    const isLive = this.isLive(match);
                    let score = "";
                    if (isLive) {
                        score = match.scores[0].value + " - " + match.scores[1].value;
                    }
                    this.matches.push({
                        competitor1: this.toDetails(match.competitors[0]),
                        competitor2: this.toDetails(match.competitors[1]),
                        date: new Date(match.startDateTS),
                        isLive: isLive,
                        score: score
                    });
                }
            });
        });
    }
    isLive(match) {
        const now = new Date();
        const startDate = new Date(match.startDateTS);
        return startDate.getTime() < now.getTime();
    }
    render() {
        let lastDate = -1;
        const matches = this.state.matches.map((match) => {
            let dateLine;
            if (lastDate != match.date.getDate()) {
                dateLine = React.createElement("div", { className: "match-date" }, DateUtils.getDayString(match.date));
                lastDate = match.date.getDate();
            }
            const matchStatus = match.isLive ? match.score : DateUtils.getTimeString(match.date);
            const matches = React.createElement("div", { className: "matchTile" },
                React.createElement("span", { className: "comp-name comp-1" }, match.competitor1.name),
                React.createElement("img", { src: match.competitor1.imageURL, className: "comp-image" }),
                React.createElement("span", { className: "match-time" }, matchStatus),
                React.createElement("img", { src: match.competitor2.imageURL, className: "comp-image" }),
                React.createElement("span", { className: "comp-name comp-2" }, match.competitor2.name));
            return [dateLine, matches];
        });
        return (React.createElement("div", { className: "eventTile ow" }, matches));
    }
}
class OWLEvents extends OverwatchEvents {
    toDetails(competitor) {
        return {
            name: competitor.name,
            imageURL: competitor.icon,
            primaryColor: competitor.primaryColor,
            secondaryColor: competitor.secondaryColor,
        };
    }
}
class WorldCupEvents extends OverwatchEvents {
    toDetails(competitor) {
        return {
            name: competitor.name,
            imageURL: this.getCompImage(competitor.name),
            primaryColor: "",
            secondaryColor: "",
        };
    }
    getCompImage(name) {
        return `https://static-wcs.starcraft2.com/flags/${name}.png`;
    }
}