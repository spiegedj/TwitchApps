declare namespace Response
{
	type Data = import("../src/IResponseInterfaces").IData;

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

	// GDQ
	interface EventRun
	{
		Date: number;
		EndDate?: number;
		Game: string;
		Category: string;
		Runner: string;
		TimeEstimate: string;
		SetupLength: string;
		Commentator: string;
		GameImage: string;
		IsLive: boolean;
	}

	// Weather
	interface Weather
	{
		Condition?: Condition;
		Forecast: Forecast[];
		Hourly: Hourly[];
	}

	interface Condition
	{
		Temp?: string;
		FeelsLike?: string;
		HighLow?: string;
		Phrase?: string;
		Icon?: string;
		Sunrise?: string;
		Sunset?: string;
		Details?: ItemDetails[];
	}

	interface Forecast
	{
		Date?: string;
		Description?: string;
		High?: string;
		Low?: string;
		Precipitation?: string;
		Wind?: string;
		Humidity?: string;
		Icon?: string;
	}

	interface Hourly
	{
		Day: string;
		Hour: string;
		Temp: string;
		Description?: string;
		Precipitation?: string;
		Wind?: string;
		Icon?: string;
	}

	interface ItemDetails
	{
		data: string;
		label: string;
		labelIcon?: string;
		dataIcon?: string;
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

	interface Metacritic
	{
		Components: MetacriticComponent[];
	}

	interface MetacriticComponent
	{
		Title: string;
		Items: MetacriticItem[];
	}

	interface MetacriticItem
	{
		Title: string;
		ImageSrc?: string;
		Type?: string;
		Score?: string;
	}
}