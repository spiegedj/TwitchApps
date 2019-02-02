/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>
class OverwatchEvents extends React.Component {
    render() {
        let lastDate = "";
        const matches = this.props.matches.map((match) => {
            let dateLine;
            const dayString = DateUtils.getDayString(new Date(match.Date));
            if (lastDate != dayString) {
                dateLine = React.createElement("div", { className: "match-date" }, dayString);
                lastDate = dayString;
            }
            const matchStatus = match.IsLive ? match.Score : DateUtils.getTimeString(new Date(match.Date));
            const matches = React.createElement("div", { className: "matchTile" },
                React.createElement("span", { className: "comp-name comp-1" }, match.Competitor1.Name),
                React.createElement("img", { src: match.Competitor1.ImageURL, className: "comp-image" }),
                React.createElement("span", { className: "match-time" }, matchStatus),
                React.createElement("img", { src: match.Competitor2.ImageURL, className: "comp-image" }),
                React.createElement("span", { className: "comp-name comp-2" }, match.Competitor2.Name));
            return [dateLine, matches];
        });
        return (React.createElement("div", { className: "eventTile ow" }, matches));
    }
}
