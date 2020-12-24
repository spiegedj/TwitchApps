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
const SteamFriendList_1 = require("./SteamFriendList");
const Lichess_1 = require("./Lichess");
let sessionId = null;
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
                SteamFriends: [],
                SessionId: null,
            },
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
            const data = yield this.get("http://localhost:3000/StatusBoard");
            if (typeof data.SessionId === "number" && typeof sessionId === "number" && data.SessionId !== sessionId) {
                location.reload();
                return;
            }
            sessionId = data.SessionId;
            this.setState({ data });
        });
    }
    render() {
        const maxColumns = 5;
        let { GDQ, StarcraftGroups, Weather, Overwatch, SteamFriends, ChessGame } = this.state.data;
        let { owColumns, scColumns, gdqColumns } = this.state;
        let centerPanel = React.createElement(StarCraftMatches_1.StarCraftMatches, { groups: StarcraftGroups, adjustColumns: cols => {
                if (scColumns != cols) {
                    this.setState({ scColumns: cols });
                }
            } });
        if (GDQ.length > 0 && DateUtils_1.DateUtils.getDaysFrom(new Date(GDQ[0].Date)) < 3) {
            centerPanel = React.createElement(GDQEvents_1.GDQEvents, { runs: GDQ });
        }
        let twichColumns = maxColumns - (owColumns + scColumns + gdqColumns);
        let showSteam = false;
        if (twichColumns > 2) {
            twichColumns--;
            showSteam = true;
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "calendar" },
                React.createElement(Weather_1.WeatherPanel, { weather: Weather }),
                React.createElement("div", { className: "columns" },
                    React.createElement(Lichess_1.Lichess, { game: ChessGame }),
                    showSteam && React.createElement(SteamFriendList_1.SteamFriendList, { friends: SteamFriends }),
                    React.createElement(OverwatchEvents_1.OverwatchEvents, { matches: Overwatch, adjustColumns: cols => cols !== owColumns && this.setState({ owColumns: cols }) }),
                    centerPanel,
                    React.createElement(TwitchStreams_1.TwitchStreams, { streams: this.state.data.TwitchStreams, columns: twichColumns }))),
            React.createElement(Headlines_1.Headlines, { headlines: this.state.data.Headlines })));
    }
}
exports.StatusBoard = StatusBoard;
