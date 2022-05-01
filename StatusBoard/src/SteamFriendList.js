"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamFriendList = void 0;
const React = require("react");
const DateUtils_1 = require("./DateUtils");
exports.SteamFriendList = (props) => {
    const sortedFriends = props.friends.sort((a, b) => {
        const stateDiff = stateToSortOrder(a.State, a.Game) - stateToSortOrder(b.State, b.Game);
        if (stateDiff == 0) {
            return b.LastLogOff - a.LastLogOff;
        }
        return stateDiff;
    }).slice(0, 14);
    return React.createElement("div", { className: "horizontal-list narrow" }, sortedFriends.map((friend) => {
        const inGame = !!friend.Game;
        const stateString = toStateString(friend);
        return React.createElement("div", { className: "tile card " + friendToCssClass(friend) },
            React.createElement("img", { className: "tile-image", crossOrigin: "anonymous", src: friend.Image }),
            React.createElement("div", { className: "alt-line1" }, friend.Name),
            React.createElement("div", { className: "alt-line2" }, stateString));
    }));
};
const toStateString = ({ State, Game, LastLogOff }) => {
    if (Game) {
        if (State == 3 /* Away */) {
            return Game + " - Away";
        }
        return Game;
    }
    switch (State) {
        case 0 /* Offline */:
            const lastlogoffDate = new Date(LastLogOff * 1000);
            return `${DateUtils_1.DateUtils.getAgoString(lastlogoffDate)}`;
        case 1 /* Online */:
            return "Online";
        case 2 /* Busy */:
            return "Busy";
        case 3 /* Away */:
            return "Away";
        case 5 /* LookingToTrade */:
            return "Looking To Trade";
        case 6 /* LookingToPlay */:
            return "Looking to Play";
    }
    return "";
};
const stateToSortOrder = (state, game) => {
    if (game) {
        return stateToSortOrder(state, "") / 10;
    }
    switch (state) {
        case 1 /* Online */:
            return 1;
        case 5 /* LookingToTrade */:
            return 2;
        case 6 /* LookingToPlay */:
            return 3;
        case 3 /* Away */:
            return 4;
        case 2 /* Busy */:
            return 5;
        case 0 /* Offline */:
            return 6;
    }
    return 7;
};
const friendToCssClass = (friend) => {
    if (friend.Game) {
        return "inGame";
    }
    switch (friend.State) {
        case 1 /* Online */:
        case 5 /* LookingToTrade */:
        case 6 /* LookingToPlay */:
            return "online";
        case 3 /* Away */:
        case 2 /* Busy */:
            return "away";
        case 0 /* Offline */:
        default:
            return "offline";
    }
};
