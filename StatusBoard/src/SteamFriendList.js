"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamFriendList = void 0;
const React = require("react");
const DateUtils_1 = require("./DateUtils");
const SteamFriendList = (props) => {
    const sortedFriends = props.friends.sort((a, b) => {
        const stateDiff = stateToSortOrder(a.State, a.Game) - stateToSortOrder(b.State, b.Game);
        if (stateDiff == 0) {
            return b.LastLogOff - a.LastLogOff;
        }
        return stateDiff;
    }).slice(0, 13);
    return React.createElement("div", { className: "steam-list" }, sortedFriends.map((friend) => {
        const stateString = toStateString(friend);
        return React.createElement("div", { className: "tile group-card tag-style " + friendToCssClass(friend) },
            React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: friend.Image }),
            React.createElement("div", { className: "alt-line1" }, friend.Name),
            React.createElement("div", { className: "alt-line2" }, stateString));
    }));
};
exports.SteamFriendList = SteamFriendList;
const toStateString = ({ State, Game, LastLogOff }) => {
    if (Game) {
        if (State == 3 /* SteamPersonaState.Away */) {
            return Game + " - Away";
        }
        return Game;
    }
    switch (State) {
        case 0 /* SteamPersonaState.Offline */:
            const lastlogoffDate = new Date(LastLogOff * 1000);
            return `${DateUtils_1.DateUtils.getAgoString(lastlogoffDate)}`;
        case 1 /* SteamPersonaState.Online */:
            return "Online";
        case 2 /* SteamPersonaState.Busy */:
            return "Busy";
        case 3 /* SteamPersonaState.Away */:
            return "Away";
        case 5 /* SteamPersonaState.LookingToTrade */:
            return "Looking To Trade";
        case 6 /* SteamPersonaState.LookingToPlay */:
            return "Looking to Play";
    }
    return "";
};
const stateToSortOrder = (state, game) => {
    if (game) {
        return stateToSortOrder(state, "") / 10;
    }
    switch (state) {
        case 1 /* SteamPersonaState.Online */:
            return 1;
        case 5 /* SteamPersonaState.LookingToTrade */:
            return 2;
        case 6 /* SteamPersonaState.LookingToPlay */:
            return 3;
        case 3 /* SteamPersonaState.Away */:
            return 4;
        case 2 /* SteamPersonaState.Busy */:
            return 5;
        case 0 /* SteamPersonaState.Offline */:
            return 6;
    }
    return 7;
};
const friendToCssClass = (friend) => {
    if (friend.Game) {
        return "inGame";
    }
    switch (friend.State) {
        case 1 /* SteamPersonaState.Online */:
        case 5 /* SteamPersonaState.LookingToTrade */:
        case 6 /* SteamPersonaState.LookingToPlay */:
            return "online";
        case 3 /* SteamPersonaState.Away */:
        case 2 /* SteamPersonaState.Busy */:
            return "away";
        case 0 /* SteamPersonaState.Offline */:
        default:
            return "offline";
    }
};
