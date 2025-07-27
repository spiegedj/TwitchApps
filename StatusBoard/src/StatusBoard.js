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
const Liquipedia_1 = require("./Liquipedia");
const GDQEvents_1 = require("./GDQEvents");
const DateUtils_1 = require("./DateUtils");
const Metacritic_1 = require("./Metacritic");
let sessionId = null;
class StatusBoard extends React.Component {
    constructor(props) {
        super(props);
        setInterval(() => this.load(), 10 * 1000);
        this.load();
        this.state = {
            data: { SessionId: null },
            gdqColumns: 0,
            owColumns: 0,
            scColumns: 0,
        };
    }
    get(url) {
        return new Promise(resolve => {
            $.get(url, result => resolve(result));
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get(window.location.href + "StatusBoard");
            if (typeof data.SessionId === "number" && typeof sessionId === "number" && data.SessionId !== sessionId) {
                location.reload();
                return;
            }
            sessionId = data.SessionId;
            this.setState({ data });
        });
    }
    render() {
        var _a, _b, _c;
        const maxColumns = 5;
        let { GDQ, StarcraftGroups, Weather, Liquipedia, Metacritic } = this.state.data;
        let TwitchStreamsResponse = this.state.data.TwitchStreams;
        let { owColumns, scColumns, gdqColumns } = this.state;
        let twitchColumns = maxColumns - (owColumns + scColumns + gdqColumns + 1);
        if (twitchColumns < 2 && scColumns > 1) {
            scColumns--;
            twitchColumns++;
        }
        if (twitchColumns < 2 && owColumns > 1) {
            owColumns--;
            twitchColumns++;
        }
        let centerPanel = React.createElement(StarCraftMatches_1.StarCraftMatches, { groups: (_a = StarcraftGroups === null || StarcraftGroups === void 0 ? void 0 : StarcraftGroups.data) !== null && _a !== void 0 ? _a : [], columns: scColumns, adjustColumns: cols => (this.state.scColumns != cols) && this.setState({ scColumns: cols }) });
        if ((GDQ === null || GDQ === void 0 ? void 0 : GDQ.data) && GDQ.data.length > 0 && DateUtils_1.DateUtils.getDaysFrom(new Date(GDQ.data[0].Date)) < 3) {
            centerPanel = React.createElement(GDQEvents_1.GDQEvents, { runs: GDQ.data });
            if (gdqColumns !== 1) {
                this.setState({ gdqColumns: 1 });
            }
        }
        else if (gdqColumns > 0) {
            this.setState({ gdqColumns: 0 });
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "calendar" },
                React.createElement(Weather_1.WeatherPanel, { Weather: Weather === null || Weather === void 0 ? void 0 : Weather.data, hash: Weather === null || Weather === void 0 ? void 0 : Weather.hash }),
                React.createElement("div", { className: "columns" },
                    React.createElement(Weather_1.HourlyForecastColumn, { Weather: Weather === null || Weather === void 0 ? void 0 : Weather.data, hash: Weather === null || Weather === void 0 ? void 0 : Weather.hash }),
                    React.createElement(Metacritic_1.MetacriticColumn, { data: Metacritic === null || Metacritic === void 0 ? void 0 : Metacritic.data }),
                    React.createElement(Liquipedia_1.EsportTournaments, { data: Liquipedia, columns: owColumns, adjustColumns: cols => cols !== this.state.owColumns && this.setState({ owColumns: cols }) }),
                    centerPanel,
                    React.createElement(TwitchStreams_1.TwitchStreams, { streams: (_b = TwitchStreamsResponse === null || TwitchStreamsResponse === void 0 ? void 0 : TwitchStreamsResponse.data) !== null && _b !== void 0 ? _b : [], hash: (_c = TwitchStreamsResponse === null || TwitchStreamsResponse === void 0 ? void 0 : TwitchStreamsResponse.hash) !== null && _c !== void 0 ? _c : 0, columns: twitchColumns })))));
    }
}
exports.StatusBoard = StatusBoard;
