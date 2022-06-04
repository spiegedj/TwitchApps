import * as React from "react";
import { DateUtils } from "./DateUtils";

const enum SteamPersonaState
{
    Offline = 0,
    Online = 1,
    Busy = 2,
    Away = 3,
    Snooze = 4,
    LookingToTrade = 5,
    LookingToPlay = 6,
}

interface ISteamFriendsProps
{
    friends: Response.SteamFriend[];
}

export const SteamFriendList = (props: ISteamFriendsProps) => 
{
    const sortedFriends = props.friends.sort((a, b) =>
    {
        const stateDiff = stateToSortOrder(a.State, a.Game) - stateToSortOrder(b.State, b.Game);
        if (stateDiff == 0)
        {
            return b.LastLogOff - a.LastLogOff;
        }
        return stateDiff;
    }).slice(0, 13);

    return <div className="steam-list">
        {sortedFriends.map((friend) =>
        {
            const stateString = toStateString(friend);
            return <div className={"tile group-card " + friendToCssClass(friend)}>
                <img className="tile-image" crossOrigin="anonymous" src={friend.Image}></img>
                <div className="alt-line1">{friend.Name}</div>
                <div className="alt-line2">{stateString}</div>
            </div>
        })}
    </div>;
}

const toStateString = ({ State, Game, LastLogOff }: Response.SteamFriend): string =>
{
    if (Game)
    {
        if (State == SteamPersonaState.Away)
        {
            return Game + " - Away";
        }
        return Game;
    }

    switch (State)
    {
        case SteamPersonaState.Offline:
            const lastlogoffDate = new Date(LastLogOff * 1000);
            return `${DateUtils.getAgoString(lastlogoffDate)}`;
        case SteamPersonaState.Online:
            return "Online";
        case SteamPersonaState.Busy:
            return "Busy";
        case SteamPersonaState.Away:
            return "Away";
        case SteamPersonaState.LookingToTrade:
            return "Looking To Trade";
        case SteamPersonaState.LookingToPlay:
            return "Looking to Play";
    }
    return "";
}

const stateToSortOrder = (state: SteamPersonaState, game: string): number =>
{
    if (game)
    {
        return stateToSortOrder(state, "") / 10;
    }

    switch (state)
    {
        case SteamPersonaState.Online:
            return 1;
        case SteamPersonaState.LookingToTrade:
            return 2;
        case SteamPersonaState.LookingToPlay:
            return 3;
        case SteamPersonaState.Away:
            return 4;
        case SteamPersonaState.Busy:
            return 5;
        case SteamPersonaState.Offline:
            return 6;
    }
    return 7;
}

const friendToCssClass = (friend: Response.SteamFriend): string =>
{
    if (friend.Game)
    {
        return "inGame";
    }

    switch (friend.State)
    {
        case SteamPersonaState.Online:
        case SteamPersonaState.LookingToTrade:
        case SteamPersonaState.LookingToPlay:
            return "online";
        case SteamPersonaState.Away:
        case SteamPersonaState.Busy:
            return "away";
        case SteamPersonaState.Offline:
        default:
            return "offline";
    }
}