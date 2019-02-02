declare namespace Response
{
    interface Data
    {
        Starcraft: StarCraftTournaments;
        Overwatch: MatchDetails[];
        GDQ: EventRun[];
        Weather: Weather;
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

    // OWL
    interface MatchDetails 
    {
        Competitor1: CompetitorDetails
        Competitor2: CompetitorDetails
        Date: number;
        IsLive: boolean;
        Score: string;
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
}