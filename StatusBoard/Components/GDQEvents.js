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
class GDQEvents extends EventTile {
    constructor() {
        super(...arguments);
        this.state = { days: [] };
        this.builder = new EventDayBuilder();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.get("https://gamesdonequick.com/schedule");
            const doc = $($.parseHTML(html));
            let days = this.parse(doc);
            this.setState({
                days: days
            });
        });
    }
    parse(document) {
        const table = document.find("#runTable").first();
        const rows = table.find("tbody").first().children();
        this.builder.clear();
        rows.each((_index, nodeArray) => {
            const tableRow = $(nodeArray);
            const className = tableRow.attr("class") || "";
            if (className.includes("second-row")) {
                this.builder.addRunRow2(tableRow);
            }
            else {
                this.builder.addRunRow1(tableRow);
            }
        });
        return this.builder.get();
    }
    render() {
        let tableRows = [];
        this.state.days.forEach((eventDay) => {
            // const dayRow =
            //     <tr>
            //         <td></td>
            //         <td className="run-date rightAlign" >
            //             {eventDay.dayString}
            //         </td>
            //         <td></td>
            //         <td></td>
            //     </tr>;
            const runs = eventDay.runs.map(run => {
                const isLive = DateUtils.isLive(run.date, run.endDate);
                return (React.createElement("tr", { className: isLive ? "live underline" : "underline" },
                    React.createElement("td", null,
                        React.createElement("img", { src: run.gameImage, className: "game-image" })),
                    React.createElement("td", { className: "rightAlign" },
                        React.createElement("div", null, DateUtils.getTimeString(run.date)),
                        React.createElement("div", { className: "lighten" }, run.timeEstimate)),
                    React.createElement("td", null,
                        React.createElement("div", null, run.game),
                        React.createElement("div", { className: "lighten" }, run.category),
                        React.createElement("div", { className: "lighten" }, run.runner))));
            });
            tableRows = tableRows.concat([...runs]);
        });
        const table1Rows = tableRows.slice(0, tableRows.length / 2);
        const table2Rows = tableRows.slice((tableRows.length / 2) - 1, tableRows.length - 1);
        return (React.createElement("div", { className: "eventTile gdq" },
            React.createElement("table", { style: { width: "50%", float: "left" } },
                React.createElement("tbody", null, table1Rows)),
            React.createElement("table", { style: { width: "50%", float: "right" } },
                React.createElement("tbody", null, table2Rows))));
    }
}
class EventDayBuilder {
    constructor() {
        this.MAX_COUNT = 8;
    }
    clear() {
        this.runs = [];
        delete this.currentRun;
    }
    get() {
        let runs = this.runs.filter(this.filterRun, this);
        runs = runs.slice(0, this.MAX_COUNT);
        let days = [];
        const dayMap = {};
        for (let run of runs) {
            const dayString = DateUtils.getDayString(run.date);
            if (!dayMap[dayString]) {
                const eventDay = {
                    dayString: dayString,
                    runs: []
                };
                dayMap[dayString] = eventDay;
                days.push(eventDay);
            }
            dayMap[dayString].runs.push(run);
        }
        return days;
    }
    filterRun(run) {
        const now = new Date();
        if (!run.endDate || run.endDate.getTime() <= now.getTime()) {
            return false;
        }
        return true;
    }
    addRunRow1(tableRow) {
        const previousRun = this.currentRun;
        const date = new Date($(tableRow.children()[0]).text());
        const game = $(tableRow.children()[1]).text();
        const runner = $(tableRow.children()[2]).text();
        const setupLength = $(tableRow.children()[3]).text();
        this.currentRun =
            {
                date: date,
                game: game,
                runner: runner,
                setupLength: setupLength
            };
        if (previousRun) {
            previousRun.endDate = date;
        }
    }
    addRunRow2(tableRow) {
        const timeEstimate = $(tableRow.children()[0]).text();
        const category = $(tableRow.children()[1]).text();
        const commentator = $(tableRow.children()[2]).text();
        this.currentRun.timeEstimate = timeEstimate;
        this.currentRun.category = category;
        this.currentRun.commentator = commentator;
        this.currentRun.gameImage = this.getGameImage(this.currentRun.game);
        this.runs.push(this.currentRun);
    }
    getGameImage(game) {
        return `https://static-cdn.jtvnw.net/ttv-boxart/${game}-130x173.jpg`;
    }
}
