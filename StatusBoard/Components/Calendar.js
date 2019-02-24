/// <reference path="StarCraftEvents.tsx"/>
/// <reference path="OverwatchEvents.tsx"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Calendar extends React.Component {
    constructor(props) {
        super(props);
        setInterval(() => this.load(), 60 * 1000);
        this.load();
        this.state = {
            data: {
                Starcraft: { WCS: [], GSL: [] },
                Overwatch: [],
                GDQ: [],
                Weather: { Condition: {}, Forecast: [] },
                StarcraftGroups: []
            }
        };
    }
    get(url) {
        return new Promise(resolve => {
            $.get(url, result => resolve(result));
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get("http://localhost:3000/StatusBoard");
            this.setState({
                data: data
            });
        });
    }
    render() {
        return (React.createElement("div", { className: "calendar card" },
            React.createElement(WeatherPanel, { weather: this.state.data.Weather }),
            React.createElement("div", { className: "columns" },
                React.createElement(OverwatchEvents, { matches: this.state.data.Overwatch }),
                React.createElement(StarCraftMatches, { groups: this.state.data.StarcraftGroups }))));
    }
}
