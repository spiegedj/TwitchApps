export interface IData
{
	SessionId: number;
	Starcraft?: IDataPart<Response.StarCraftTournaments>;
	Liquipedia?: IDataPart<ITournament[]>;
	GDQ?: IDataPart<Response.EventRun[]>;
	Weather?: IDataPart<Response.Weather>;
	StarcraftGroups?: IDataPart<Response.Group[]>;
	TwitchStreams?: IDataPart<Response.TwitchStream[]>;
	Headlines?: IDataPart<Response.Headline[]>;
	SteamFriends?: IDataPart<Response.SteamFriend[]>;
	ChessGame?: IDataPart<Response.LichessGame>;
}

export interface IDataPart<T>
{
	hash: number;
	data: T;
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