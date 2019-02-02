/// <reference path="Calendar.tsx"/>
/// <reference path="../Scripts/DateUtils.ts"/>

type gdqProps = Partial<{
    runs: Response.EventRun[]
}>;

class GDQEvents extends React.Component<gdqProps>
{
    public render(): React.ReactNode 
    {
        let tableRows = this.props.runs.map((run: Response.EventRun) =>
        {
            const runDate = new Date(run.Date);
            const endDate = new Date(run.EndDate);
            const isLive = DateUtils.isLive(runDate, endDate);
            return (
                <tr className={isLive ? "live underline" : "underline"}>
                    <td>
                        <img src={run.GameImage} className="game-image" />
                    </td>
                    <td className="rightAlign">
                        <div>{DateUtils.getTimeString(runDate)}</div>
                        <div className="lighten">{run.TimeEstimate}</div>
                    </td>
                    <td>
                        <div>{run.Game}</div>
                        <div className="lighten">{run.Category}</div>
                    </td>
                    <td>
                        <div>{run.Runner}</div>
                        <div className="lighten">{run.Commentator}</div>
                    </td>
                </tr>
            );
        });

        return (
            <div className="eventTile gdq">
                <table>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }
}