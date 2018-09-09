/// <reference path="StarCraftEvents.tsx"/>
class EventTile extends React.Component {
    constructor(props) {
        super(props);
        setInterval(() => this.load(), 60 * 1000);
        this.load();
    }
}
class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        };
    }
    render() {
        return (React.createElement("div", { className: "calendar card" },
            React.createElement(WCSEvents, null),
            React.createElement(GSLEvents, null),
            React.createElement(StarCraftEvents, null)));
    }
}
