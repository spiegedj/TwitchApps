"use strict";
/// <reference path="../@types/data.d.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Weather_1 = require("./Weather");
const StarCraftMatches_1 = require("./StarCraftMatches");
const TwitchStreams_1 = require("./TwitchStreams");
const OverwatchEvents_1 = require("./OverwatchEvents");
class StatusBoard extends React.Component {
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
                StarcraftGroups: [],
                TwitchStreams: []
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
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "calendar" },
                React.createElement(Weather_1.WeatherPanel, { weather: this.state.data.Weather }),
                React.createElement("div", { className: "columns" },
                    React.createElement(OverwatchEvents_1.OverwatchEvents, { matches: this.state.data.Overwatch }),
                    React.createElement(StarCraftMatches_1.StarCraftMatches, { groups: this.state.data.StarcraftGroups }))),
            React.createElement(TwitchStreams_1.TwitchStreams, { streams: this.state.data.TwitchStreams })));
    }
}
exports.StatusBoard = StatusBoard;
