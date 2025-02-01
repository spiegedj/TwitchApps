export interface IData
{
	SessionId: number;
	Starcraft: Response.StarCraftTournaments;
	Liquipedia: {
		hash: number;
		tournaments: ITournament[];
	};
	GDQ: Response.EventRun[];
	Weather: Response.Weather;
	StarcraftGroups: Response.Group[];
	TwitchStreams: Response.TwitchStream[];
	Headlines: Response.Headline[];
	SteamFriends: Response.SteamFriend[];
	ChessGame?: Response.LichessGame;
}

// Liquidpedia
export type EsportGame = "starcraft2" | "overwatch";
export type Race = "Zerg" | "Protoss" | "Terran";

export interface ITournament
{
	name: string;
	game: EsportGame;
	dates: string;
	tier: number;
	tierName: string;
	matches: IMatchDetails[];
	startDate: number | undefined;
	nextMatchDate?: number | undefined;
	isUpcoming: boolean;
	imageUrl?: string;
}

export interface IMatchDetails 
{
	tournamentName: string;
	competitor1: ICompetitorDetails;
	competitor2: ICompetitorDetails;
	date: number;
	isConcluded: boolean;
	isLive: boolean;
	score: string;
	isEncore: boolean;
}

export interface ICompetitorDetails
{
	name: string;
	nameAbbr?: string;
	imageUrl?: string;
	primaryColor?: string;
	secondaryColor?: string;
	race?: Race;
}