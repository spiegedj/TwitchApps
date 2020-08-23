"use strict";
/// <reference path="../@types/data.d.ts"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBoard = void 0;
const React = require("react");
const Weather_1 = require("./Weather");
const StarCraftMatches_1 = require("./StarCraftMatches");
const TwitchStreams_1 = require("./TwitchStreams");
const OverwatchEvents_1 = require("./OverwatchEvents");
const GDQEvents_1 = require("./GDQEvents");
const DateUtils_1 = require("./DateUtils");
const Headlines_1 = require("./Headlines");
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
                Weather: { Condition: {}, Forecast: [], Hourly: [] },
                StarcraftGroups: [],
                TwitchStreams: [],
                Headlines: [],
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
            const data = yield this.get("http://192.168.1.19:3000/StatusBoard");
            this.setState({
                data: data
            });
        });
    }
    render() {
        let { GDQ, StarcraftGroups, Weather, Overwatch } = this.state.data;
        let centerPanel = React.createElement(StarCraftMatches_1.StarCraftMatches, { groups: StarcraftGroups });
        if (GDQ.length > 0 && DateUtils_1.DateUtils.getDaysFrom(new Date(GDQ[0].Date)) < 3) {
            centerPanel = React.createElement(GDQEvents_1.GDQEvents, { runs: GDQ });
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "calendar" },
                React.createElement(Weather_1.WeatherPanel, { weather: Weather }),
                React.createElement("div", { className: "columns" },
                    React.createElement(OverwatchEvents_1.OverwatchEvents, { matches: Overwatch }),
                    centerPanel)),
            React.createElement(TwitchStreams_1.TwitchStreams, { streams: this.state.data.TwitchStreams }),
            React.createElement(Headlines_1.Headlines, { headlines: this.state.data.Headlines })));
    }
}
exports.StatusBoard = StatusBoard;
