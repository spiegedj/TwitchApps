/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>

interface EventDay 
{
    dayString: string;
    runs: EventRun[];
}

interface EventRun
{
    date: Date;
    endDate?: Date;
    length: number;
    game: string;
    category: string;
    runner: string;
    timeEstimate: string;
    setupLength: string;
    commentator: string;
    gameImage: string;
}

class GDQEvents extends EventTile 
{
    public state: { days: EventDay[] } = { days: [] };
    private builder: EventDayBuilder = new EventDayBuilder();

    public async load(): Promise<void> 
    {
        const html = await this.get("https://gamesdonequick.com/schedule");
        const doc = $($.parseHTML(html));
        let days = this.parse(doc);

        this.setState({ days: days });
    }

    private parse(document: JQuery<JQuery.Node[]>): EventDay[] 
    {
        const table = document.find("#runTable").first();
        const rows = table.find("tbody").first().children();

        this.builder.clear();
        rows.each((_index: number, nodeArray: Node[]) =>
        {
            const tableRow = $(nodeArray);
            const className = tableRow.attr("class") || "";
            if (className.includes("second-row"))
            {
                this.builder.addRunRow2(tableRow);
            }
            else 
            {
                this.builder.addRunRow1(tableRow);
            }
        });

        return this.builder.get();
    }

    public render(): React.ReactNode 
    {
        let tableRows: JSX.Element[] = [];
        this.state.days.forEach((eventDay: EventDay) =>
        {
            // const dayRow =
            //     <tr>
            //         <td></td>
            //         <td className="run-date rightAlign" >
            //             {eventDay.dayString}
            //         </td>
            //         <td></td>
            //         <td></td>
            //     </tr>;

            const runs = eventDay.runs.map(run =>
            {
                const isLive = DateUtils.isLive(run.date, run.endDate);
                return (
                    <tr className={isLive ? "live underline" : "underline"}>
                        <td>
                            <img src={run.gameImage} className="game-image" />
                        </td>
                        <td className="rightAlign">
                            <div>{DateUtils.getTimeString(run.date)}</div>
                            <div className="lighten">{run.timeEstimate}</div>
                        </td>
                        <td>
                            <div>{run.game}</div>
                            <div className="lighten">{run.category}</div>
                            <div className="lighten">{run.runner}</div>
                        </td>
                    </tr>
                );
            });

            tableRows = tableRows.concat([...runs]);
        });

        const table1Rows = tableRows.slice(0, tableRows.length / 2);
        const table2Rows = tableRows.slice((tableRows.length / 2) - 1, tableRows.length - 1);

        return (
            <div className="eventTile gdq">
                <table style={{ width: "50%", float: "left" }}>
                    <tbody>
                        {table1Rows}
                    </tbody>
                </table>

                <table style={{ width: "50%", float: "right" }}>
                    <tbody>
                        {table2Rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

class EventDayBuilder 
{
    private readonly MAX_COUNT: number = 8;

    private runs: EventRun[];
    private currentRun: Partial<EventRun>;

    public clear(): void
    {
        this.runs = [];
        delete this.currentRun;
    }

    public get(): EventDay[]
    {
        let runs = this.runs.filter(this.filterRun, this);
        runs = runs.slice(0, this.MAX_COUNT);

        let days: EventDay[] = [];
        const dayMap: { [key: string]: EventDay } = {};

        for (let run of runs)
        {
            const dayString = DateUtils.getDayString(run.date);
            if (!dayMap[dayString])
            {
                const eventDay: EventDay =
                {
                    dayString: dayString,
                    runs: []
                }
                dayMap[dayString] = eventDay;
                days.push(eventDay);
            }
            dayMap[dayString].runs.push(run);
        }

        return days;
    }

    protected filterRun(run: EventRun)
    {
        const now = new Date();
        if (!run.endDate || run.endDate.getTime() <= now.getTime())
        {
            return false;
        }

        return true;
    }

    public addRunRow1(tableRow: JQuery<Node[]>): void
    {
        const previousRun = this.currentRun;
        const date = new Date($(tableRow.children()[0]).text());
        const game = $(tableRow.children()[1]).text();
        const runner = $(tableRow.children()[2]).text();
        const setupLength = $(tableRow.children()[3]).text();

        this.currentRun =
            {
                date: date,
                game: game,
                runner: runner,
                setupLength: setupLength
            };

        if (previousRun)
        {
            previousRun.endDate = date
        }
    }

    public addRunRow2(tableRow: JQuery<Node[]>): void
    {
        const timeEstimate = $(tableRow.children()[0]).text();
        const category = $(tableRow.children()[1]).text();
        const commentator = $(tableRow.children()[2]).text();

        this.currentRun.timeEstimate = timeEstimate;
        this.currentRun.category = category;
        this.currentRun.commentator = commentator;
        this.currentRun.gameImage = this.getGameImage(this.currentRun.game);

        this.runs.push(this.currentRun as EventRun);
    }

    private getGameImage(game: string): string
    {
        return `https://static-cdn.jtvnw.net/ttv-boxart/${game}-130x173.jpg`;
    }
}