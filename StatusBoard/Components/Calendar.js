class EventTile extends React.Component {
    get details() {
        return this.props.details;
    }
    render() {
        return (React.createElement("div", { className: "eventTile" },
            React.createElement("div", { className: "eventName" }, this.details.eventName),
            React.createElement("div", null, this.details.eventDetails),
            React.createElement("img", { className: "eventLogo", src: this.details.eventLogo }),
            React.createElement("div", null, DateUtils.getDateString(this.details.eventDate)),
            React.createElement("div", null, DateUtils.getCountdownString(this.details.eventDate))));
    }
}
class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        };
        this.wcsEvents();
    }
    wcsEvents() {
        $.get("https://wcs.starcraft2.com/en-us/schedule/", function (html) {
            this.parseWCSEvents(html);
        }.bind(this));
    }
    parseWCSEvents(html) {
        const doc = $($.parseHTML(html));
        const cards = doc.find(".eventCard-entry");
        const events = [];
        cards.each((index, card) => {
            const tournament = $(card).find(".metaData-hd").first().children().first().text();
            const stage = $(card).find(".meta-Data-ft").first().children().first().text();
            const logo = $(card).find(".eventCard-logo").first().children().first().attr("src");
            const timestamp = Number($(card).find(".eventCard-time").first().children().first().attr("data-locale-time-timestamp"));
            events.push({
                eventName: tournament,
                eventDetails: stage,
                eventLogo: logo,
                eventDate: new Date(timestamp)
            });
        });
        events.length = 6;
        this.setState({
            events: events
        });
    }
    render() {
        const tiles = this.state.events.map((details) => {
            return React.createElement(EventTile, { details: details });
        });
        return (React.createElement("div", { className: "calendar card" }, tiles));
    }
}
// $(document).ready(function() {
//     ReactDOM.render(<Calendar />, document.getElementById("main-div"));
// });
