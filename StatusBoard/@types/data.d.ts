declare namespace Response
{
    interface Data
    {
        Starcraft: StarCraftTournaments;
        Overwatch: MatchDetails[];
        GDQ: EventRun[];
        Weather: Weather;
        StarcraftGroups: Group[];
        TwitchStreams: TwitchStream[];
        Headlines: Headline[];
        SessionId: number;
        SteamFriends: SteamFriend[];
        ChessGame?: LichessGame;
    }

    // Twitch
    interface TwitchStream 
    {
        Streamer: string;
        Game: string;
        Status: string;
        Viewers: number;
        ImageURL: string;
        Link: string;
        Followed: boolean;
    }

    // SC2
    interface TournamentDay 
    {
        Stage: string,
        Date?: number,
        IsLive: boolean;
    }

    interface Tournament 
    {
        Name: string;
        LogoURL: string,
        Days: TournamentDay[];
    }

    interface StarCraftTournaments
    {
        WCS: Tournament[];
        GSL: Tournament[];
    }

    interface Group
    {
        Name: string;
        Date: number;
        Players: GroupPlayer[];
    }

    interface GroupPlayer
    {
        Name: string;
        Race: string;
    }

    // OWL
    interface MatchDetails 
    {
        Competitor1: CompetitorDetails
        Competitor2: CompetitorDetails
        Date: number;
        IsConcluded: boolean;
        IsLive: boolean;
        Score: string;
        IsEncore: boolean;
    }

    interface CompetitorDetails 
    {
        Name: string;
        ImageURL?: string;
        PrimaryColor?: string;
        SecondaryColor?: string;
    }

    // GDQ
    interface EventRun
    {
        Date: number;
        EndDate?: number;
        Length: number;
        Game: string;
        Category: string;
        Runner: string;
        TimeEstimate: string;
        SetupLength: string;
        Commentator: string;
        GameImage: string;
    }

    // Weather
    interface Weather
    {
        Condition: Condition;
        Forecast: Forecast[];
        Hourly: Hourly[];
    }

    interface Condition
    {
        Temp: string;
        FeelsLike: string;
        HighLow: string;
        Phrase: string;
        Icon: string;
    }

    interface Forecast
    {
        Date: string;
        Description: string;
        High: string;
        Low: string;
        Precipitation: string;
        Wind: string;
        Humidity: string;
        Icon: string;
    }

    interface Hourly
    {
        Temp: string;
        Hour: string;
        Description: string;
        Precipitation: string;
        Wind: string;
        Icon: string;
    }

    interface Headline
    {
        Title: string;
        Date: number;
    }

    interface SteamFriend
    {
        Name: string;
        State: number;
        Image: string;
        Game: string;
        LastLogOff: number;
    }

    interface LichessGame
    {
        GameId: string;
        White: ChessPlayer;
        Black: ChessPlayer;
        Rated: boolean;
        Speed: string;
        Status: string;
        Variant: string;
    }

    interface ChessPlayer
    {
        Rating: number;
        Name: string;
    }
}