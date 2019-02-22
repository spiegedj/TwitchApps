/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>
const swapColors = [
    "hangzhou spark",
    "boston uprising",
    "houston outlaws",
    "toronto defiant"
];
class OverwatchEvents extends React.Component {
    splitByDay(matches) {
        const days = [];
        while (matches.length > 0) {
            const match = matches.shift();
            const matchDay = {
                date: new Date(match.Date),
                matches: [match]
            };
            for (var i = 0; i < matches.length; i++) {
                const iMatch = matches[i];
                if (DateUtils.onSameDay(matchDay.date, new Date(iMatch.Date))) {
                    matches.splice(i, 1);
                    matchDay.matches.push(iMatch);
                    i--;
                }
            }
            days.push(matchDay);
        }
        return days;
    }
    getLargePanel(match) {
        const compNamePieces1 = this.splitName(match.Competitor1.Name);
        const compNamePieces2 = this.splitName(match.Competitor2.Name);
        const status = match.IsLive ? match.Score : DateUtils.getTimeString(new Date(match.Date));
        return React.createElement("div", { className: "largeTile" },
            React.createElement("div", { className: "comp", style: { backgroundColor: this.getColor(match.Competitor1) } },
                React.createElement("img", { src: match.Competitor1.ImageURL, className: "image" }),
                React.createElement("div", { className: "comp-name-1" }, compNamePieces1.piece1),
                React.createElement("div", { className: "comp-name-2" }, compNamePieces1.piece2)),
            React.createElement("span", { className: "status" }, status),
            React.createElement("div", { className: "comp", style: { backgroundColor: this.getColor(match.Competitor2) } },
                React.createElement("img", { src: match.Competitor2.ImageURL, className: "image" }),
                React.createElement("div", { className: "comp-name-1" }, compNamePieces2.piece1),
                React.createElement("div", { className: "comp-name-2" }, compNamePieces2.piece2)));
    }
    getSmallPanel(match) {
        const compNamePieces1 = this.splitName(match.Competitor1.Name);
        const compNamePieces2 = this.splitName(match.Competitor2.Name);
        const status = match.IsLive ? match.Score : DateUtils.getTimeString(new Date(match.Date));
        return React.createElement("div", { className: "tile" },
            React.createElement("div", { className: "comp comp-1", style: { backgroundColor: this.getColor(match.Competitor1) } },
                React.createElement("div", { className: "comp-name-1" }, compNamePieces1.piece1),
                React.createElement("div", { className: "comp-name-2" }, compNamePieces1.piece2),
                React.createElement("img", { src: match.Competitor1.ImageURL, className: "image" })),
            React.createElement("span", { className: "status" }, status),
            React.createElement("div", { className: "comp comp-2", style: { backgroundColor: this.getColor(match.Competitor2) } },
                React.createElement("div", { className: "comp-name-1" }, compNamePieces2.piece1),
                React.createElement("span", { className: "comp-name-2" }, compNamePieces2.piece2),
                React.createElement("img", { src: match.Competitor2.ImageURL, className: "image" })));
    }
    render() {
        const panels = [];
        const matchDays = this.splitByDay(this.props.matches || []);
        const firstMatch = matchDays.shift();
        if (firstMatch) {
            let matchPanels = firstMatch.matches.map(m => this.getLargePanel(m));
            panels.push(React.createElement("span", { className: "group" },
                React.createElement("span", null,
                    React.createElement(DateHeader, { dates: [firstMatch.date], showTimeCells: false }),
                    matchPanels)));
        }
        let nextMatches = matchDays.slice(0, 3);
        panels.push(React.createElement("span", { className: "group" }, nextMatches.map(day => React.createElement("span", null,
            React.createElement(DateHeader, { dates: [day.date], showTimeCells: false }),
            day.matches.map(m => this.getSmallPanel(m))))));
        return (React.createElement("div", { className: "ow" }, panels));
    }
    getColor(competitor) {
        if (swapColors.indexOf(competitor.Name.toLowerCase()) >= 0) {
            return "#" + competitor.SecondaryColor;
        }
        return "#" + competitor.PrimaryColor;
    }
    splitName(name) {
        const pieces = name.split(" ");
        const lastPiece = pieces.pop();
        return { piece1: pieces.join(" "), piece2: lastPiece };
    }
}
