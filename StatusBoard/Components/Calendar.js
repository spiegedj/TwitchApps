/// <reference path="StarCraftEvents.tsx"/>
/// <reference path="OverwatchEvents.tsx"/>
class EventTile extends React.Component {
    constructor(props) {
        super(props);
        setInterval(() => this.load(), 60 * 1000);
        this.load();
    }
    get(url) {
        return new Promise(resolve => {
            $.get(url, result => resolve(result));
        });
    }
}
class Calendar extends React.Component {
    render() {
        return (React.createElement("div", { className: "calendar card" },
            React.createElement(WCSEvents, null),
            React.createElement(GSLEvents, null),
            React.createElement(OWLEvents, null)));
    }
}
